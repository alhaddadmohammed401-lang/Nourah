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
import { PendingScanCard } from '../../components/home/PendingScanCard';
import { FailedScanCard } from '../../components/home/FailedScanCard';
import { useLatestScan } from '../../hooks/useLatestScan';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';
import { useTheme } from '../../hooks/useTheme';
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
  const { theme, colors: themeColors } = useTheme();
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

  // Reads is_premium from public.subscriptions via subscriptionService. The Routine
  // screen's plan.isPremium comes from the routine-generate edge function which reads
  // the same row server-side — keeping the two paths in sync.
  const { isPremium } = usePremiumStatus();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const goToScan = useCallback(() => {
    router.push('/(tabs)/scan');
  }, [router]);

  const completeScan = scan && scan.status === 'complete' ? scan : null;
  const pendingScan = scan && scan.status === 'pending' ? scan : null;
  const failedScan = scan && scan.status === 'failed' ? scan : null;
  const stale = completeScan ? isStaleScan(completeScan) : false;
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
      const band = bandFromScore(s.overall_score ?? 50);
      if (band === 'green') return t('home.score.reassureGreen');
      if (band === 'amber') return t('home.score.reassureAmber');
      return t('home.score.reassureRed');
    },
    [t]
  );

  const categoryLabelFor = useCallback(
    (s: ScanResult) => {
      const band = bandFromScore(s.overall_score ?? 50);
      if (band === 'green') return t('home.score.categoryGreen');
      if (band === 'amber') return t('home.score.categoryAmber');
      return t('home.score.categoryRed');
    },
    [t]
  );

  return (
    <SafeAreaView className="flex-1 bg-softBlush">
      {/* StatusBar icon color flips with theme so the time/battery glyphs stay readable
        against the new surface. backgroundColor reads from the active theme so the bar
        matches the page surface in both modes. */}
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.surface}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
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
          ) : pendingScan ? (
            <PendingScanCard />
          ) : failedScan ? (
            <FailedScanCard rawError={failedScan.error} onRetake={goToScan} />
          ) : completeScan ? (
            <ScoreCard
              score={completeScan.overall_score ?? 50}
              band={bandFromScore(completeScan.overall_score ?? 50)}
              label={categoryLabelFor(completeScan)}
              reassurance={reassuranceFor(completeScan)}
              flags={completeScan.gcc_flags.map(flagLabelI18n)}
              caption={
                stale
                  ? t('home.score.lastScanFmt', { days: daysSinceScan(completeScan) })
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

      {/* Hide the global "Scan again" CTA when a state-card already owns the primary
        action. Avoids two stacked buttons fighting at the bottom of the screen — pending
        has no action to take, failed has its own Retake button inside the card. */}
      {pendingScan || failedScan ? null : (
        <StickyScanCTA label={ctaLabel} hint={ctaHint} onPress={goToScan} />
      )}
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
