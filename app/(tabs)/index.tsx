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
  SAMPLE_AM_STEPS,
} from '../../components/home/RoutinePreviewCard';
import { DailyTip } from '../../components/home/DailyTip';
import { StickyScanCTA } from '../../components/home/StickyScanCTA';
import { useLatestScan } from '../../hooks/useLatestScan';
import { useAuth } from '../../hooks/useAuth';
import { tipForToday } from '../../constants/tips';
import { getTodayClimate, flagLabel } from '../../constants/climate';
import {
  bandFromScore,
  daysSinceScan,
  isStaleScan,
  type ScanResult,
} from '../../services/scanService';
import { colors } from '../../constants/colors';

function greetingFor(hour: number): string {
  if (hour >= 4 && hour < 11) return 'Good morning';
  if (hour >= 11 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 23) return 'Good evening';
  return 'Still up';
}

function dateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function reassuranceFor(scan: ScanResult): string {
  const band = bandFromScore(scan.overall_score);
  if (band === 'green') return 'Your skin is doing well today.';
  if (band === 'amber') return 'A few things to watch. Nothing urgent.';
  return "Let's take it gentle today.";
}

function categoryLabel(scan: ScanResult): string {
  const band = bandFromScore(scan.overall_score);
  if (band === 'green') return 'Overall · looking good';
  if (band === 'amber') return 'Overall · keep an eye out';
  return 'Overall · take it easy';
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { scan, loading, error, refetch } = useLatestScan();
  const [refreshing, setRefreshing] = useState(false);

  const now = useMemo(() => new Date(), []);
  const climate = useMemo(() => getTodayClimate(now), [now]);
  const greeting = useMemo(() => greetingFor(now.getHours()), [now]);
  const datePretty = useMemo(() => dateLabel(now), [now]);
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
  const ctaLabel = !scan ? 'Start your first scan' : stale ? 'Scan now' : 'Scan again';
  const ctaHint = stale ? "It's been a while. Quick check?" : undefined;

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
            <ScoreCardSkeleton />
          ) : error ? (
            <ErrorCard onRetry={onRefresh} />
          ) : scan ? (
            <ScoreCard
              score={scan.overall_score}
              band={bandFromScore(scan.overall_score)}
              label={categoryLabel(scan)}
              reassurance={reassuranceFor(scan)}
              flags={scan.gcc_flags.map(flagLabel)}
              caption={stale ? `Last scan ${daysSinceScan(scan)} days ago` : undefined}
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
              steps={SAMPLE_AM_STEPS}
              isPremium={isPremium}
              onPress={() => {
                // Routine screen is out of scope for this craft run.
              }}
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

function ScoreCardSkeleton() {
  return (
    <View
      className="rounded-2xl bg-lightGray p-5 opacity-50"
      style={{ height: 168 }}
      accessibilityLabel="Loading your latest scan"
    />
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="rounded-2xl bg-white p-5">
      <Text className="text-[15px] leading-6 text-deepMauve">
        Can't reach your data right now.
      </Text>
      <Text
        className="mt-2 text-[13px] font-medium text-brandRose"
        onPress={onRetry}
        accessibilityRole="button"
      >
        Pull down to retry
      </Text>
    </View>
  );
}
