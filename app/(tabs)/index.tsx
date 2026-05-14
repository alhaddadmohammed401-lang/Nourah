import { useMemo, useState, useCallback } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { HomeHeader } from '../../components/home/HomeHeader';
import { FirstScanCard } from '../../components/home/FirstScanCard';
import { ScoreCard } from '../../components/ui/ScoreCard';
import {
  RoutinePreviewCard,
  buildSampleAmSteps,
} from '../../components/home/RoutinePreviewCard';
import { DailyTip } from '../../components/home/DailyTip';
import { StickyScanCTA } from '../../components/home/StickyScanCTA';
import { useLatestScan } from '../../hooks/useLatestScan';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { tipForToday } from '../../constants/tips';
import { getTodayClimate } from '../../constants/climate';
import {
  bandFromScore,
  daysSinceScan,
  isStaleScan,
  type ScanResult,
} from '../../services/scanService';
import { colors } from '../../constants/colors';

function greetingKeyFor(hour: number): string {
  if (hour >= 4 && hour < 11) return 'home.greeting.morning';
  if (hour >= 11 && hour < 17) return 'home.greeting.afternoon';
  if (hour >= 17 && hour < 23) return 'home.greeting.evening';
  return 'home.greeting.night';
}

function dateLabel(date: Date, lang: 'en' | 'ar'): string {
  return date.toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { scan, loading, error, refetch } = useLatestScan();
  const [refreshing, setRefreshing] = useState(false);

  const now = useMemo(() => new Date(), []);
  const climate = useMemo(() => getTodayClimate(now), [now]);
  const greeting = useMemo(() => t(greetingKeyFor(now.getHours())), [now, t]);
  const datePretty = useMemo(() => dateLabel(now, lang), [now, lang]);
  const tip = useMemo(() => tipForToday(now), [now]);

  const firstName = useMemo(() => {
    const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
    const candidate = (meta.first_name ?? meta.name) as string | undefined;
    if (typeof candidate === 'string' && candidate.length > 0) {
      return candidate.split(' ')[0];
    }
    if (user?.email) return user.email.split('@')[0];
    return null;
  }, [user]);

  // For mock mode, treat is_premium as false so the gold nudge shows. Real value comes
  // from the profile/RevenueCat in a later craft run.
  const isPremium = false;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const goToScan = useCallback(() => {
    router.push('/(tabs)/scan');
  }, [router]);

  const stale = scan ? isStaleScan(scan) : false;
  const ctaLabel = !scan
    ? t('home.cta.firstScan')
    : stale
    ? t('home.cta.scanNow')
    : t('home.cta.scanAgain');
  const ctaHint = stale ? t('home.cta.staleHint') : undefined;

  const flagLabelI18n = useCallback(
    (flag: 'high_uv' | 'humidity_warning' | 'melasma_risk') => t(`home.flags.${flag}`),
    [t]
  );

  const reassuranceFor = useCallback(
    (s: ScanResult) => {
      const band = bandFromScore(s.overall_score);
      if (band === 'green') return t('home.score.reassureGreen');
      if (band === 'amber') return t('home.score.reassureAmber');
      return t('home.score.reassureRed');
    },
    [t]
  );

  const categoryLabelFor = useCallback(
    (s: ScanResult) => {
      const band = bandFromScore(s.overall_score);
      if (band === 'green') return t('home.score.categoryGreen');
      if (band === 'amber') return t('home.score.categoryAmber');
      return t('home.score.categoryRed');
    },
    [t]
  );

  return (
    <SafeAreaView className="flex-1 bg-softBlush">
      <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brandRose}
            colors={[colors.brandRose]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          greeting={greeting}
          name={firstName}
          dateLabel={datePretty}
          climate={climate}
          onClimatePress={() => {
            // Bottom-sheet explainer is out of scope for this craft run; tap is a no-op for now.
          }}
        />

        <View className="px-5 pt-1">
          {loading ? (
            <ScoreCardSkeleton a11yLabel={t('home.score.loadingLabel')} />
          ) : error ? (
            <ErrorCard onRetry={onRefresh} />
          ) : scan ? (
            <ScoreCard
              score={scan.overall_score}
              band={bandFromScore(scan.overall_score)}
              label={categoryLabelFor(scan)}
              reassurance={reassuranceFor(scan)}
              flags={scan.gcc_flags.map(flagLabelI18n)}
              caption={
                stale
                  ? t('home.score.lastScanFmt', { days: daysSinceScan(scan) })
                  : undefined
              }
              onPress={() => {
                // Detail screen is out of scope for this craft run.
              }}
            />
          ) : (
            <FirstScanCard onPress={goToScan} />
          )}
        </View>

        {scan ? (
          <View className="mt-4 px-5">
            <RoutinePreviewCard
              window="AM"
              steps={buildSampleAmSteps(t)}
              isPremium={isPremium}
              onPress={() => router.push('/(tabs)/routine')}
            />
          </View>
        ) : null}

        <View className="mt-2">
          <DailyTip tip={tip} />
        </View>
      </ScrollView>

      <StickyScanCTA label={ctaLabel} hint={ctaHint} onPress={goToScan} />
    </SafeAreaView>
  );
}

function ScoreCardSkeleton({ a11yLabel }: { a11yLabel: string }) {
  return (
    <View
      className="rounded-2xl bg-lightGray p-5 opacity-50"
      style={{ height: 168 }}
      accessibilityLabel={a11yLabel}
    />
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();

  return (
    <View className="rounded-2xl bg-white p-5">
      <Text className="text-[15px] leading-6 text-deepMauve">{t('home.error.title')}</Text>
      <Text
        className="mt-2 text-[13px] font-medium text-brandRose"
        onPress={onRetry}
        accessibilityRole="button"
      >
        {t('home.error.retry')}
      </Text>
    </View>
  );
}
