// Scan History — reads every past scan for the signed-in user (newest first) and
// renders them as a quiet typographic list. Reached from Profile via "View all scans →".
// Hidden from the tab bar via `href: null` in (tabs)/_layout.tsx.

import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { listScans, type ScanResult, type ScoreBand } from '../../services/scanService';

function dotColorForBand(band: ScoreBand | null): string {
  switch (band) {
    case 'green':
      return colors.success;
    case 'amber':
      return colors.warning;
    case 'red':
      return colors.error;
    default:
      return colors.lightGray;
  }
}

function bandReassureKey(band: ScoreBand | null): string {
  switch (band) {
    case 'green':
      return 'profile.history.bandGreen';
    case 'amber':
      return 'profile.history.bandAmber';
    case 'red':
      return 'profile.history.bandRed';
    default:
      return 'profile.history.bandAmber';
  }
}

function formatDate(iso: string, lang: 'en' | 'ar'): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ScanHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [scans, setScans] = useState<ScanResult[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await listScans(user?.id ?? null);
    setScans(list);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const close = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/profile');
  }, [router]);

  return (
    <View className="flex-1 bg-softBlush">
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-10 pt-6">
            {/* Back affordance — quiet ghost link, top-left, matches Routine "back to home". */}
            <Pressable
              onPress={close}
              accessibilityRole="button"
              hitSlop={8}
              className="self-start active:opacity-60"
              style={{ paddingVertical: 6, paddingRight: 8 }}
            >
              <Text className="text-[14px] font-medium text-brandRose">← {t('routine.back')}</Text>
            </Pressable>

            <Text
              className="mt-4 text-deepMauve"
              style={{
                fontFamily: 'DMSerifDisplay-Regular',
                fontSize: 32,
                fontWeight: '400',
                lineHeight: 38,
                letterSpacing: -0.3,
              }}
            >
              {t('profile.history.title')}
            </Text>
            <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
              {t('profile.history.subtitle')}
            </Text>

            <View className="mt-7">
              {loading ? (
                <View className="items-center py-12">
                  <ActivityIndicator color={colors.brandRose} />
                </View>
              ) : !scans || scans.length === 0 ? (
                <View className="py-10">
                  <Text
                    className="text-deepMauve"
                    style={{
                      fontFamily: 'DMSerifDisplay-Regular',
                      fontSize: 22,
                      lineHeight: 28,
                    }}
                  >
                    {t('profile.history.emptyTitle')}
                  </Text>
                  <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
                    {t('profile.history.emptyBody')}
                  </Text>
                </View>
              ) : (
                scans.map((scan, idx) => {
                  const isPending = scan.status === 'pending';
                  const isFailed = scan.status === 'failed';
                  const date = formatDate(scan.created_at, lang);
                  const score = scan.overall_score;
                  const band = scan.band;
                  const reassure = isPending
                    ? t('profile.history.pendingLabel')
                    : isFailed
                    ? t('profile.history.failedLabel')
                    : t(bandReassureKey(band));

                  return (
                    <View
                      key={scan.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 16,
                        borderBottomWidth: idx < scans.length - 1 ? 1 : 0,
                        borderBottomColor: 'rgba(212, 160, 167, 0.25)',
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: isFailed
                            ? colors.error
                            : isPending
                            ? colors.warning
                            : dotColorForBand(band),
                          marginRight: 14,
                        }}
                      />
                      <View className="flex-1">
                        <Text className="text-[14px] text-darkGray">{date}</Text>
                        <Text className="mt-0.5 text-[15px] font-semibold text-deepMauve">
                          {reassure}
                        </Text>
                      </View>
                      {!isFailed && !isPending && typeof score === 'number' ? (
                        <Text
                          style={{
                            fontFamily: 'DMSerifDisplay-Regular',
                            fontSize: 28,
                            lineHeight: 32,
                            color: colors.brandRose,
                            letterSpacing: 0.3,
                          }}
                        >
                          {score}
                        </Text>
                      ) : null}
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
