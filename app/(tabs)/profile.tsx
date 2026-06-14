import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { colors, type ThemeColors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme, type ThemeMode } from '../../hooks/useTheme';
import type { Lang } from '../../constants/locales';
import { signOut } from '../../services/auth';

// Settings + identity surface. Headlines the language toggle so the bilingual promise is
// always within reach. Sign-out lives at the bottom because it's the destructive path.
// Polish theme: identity first, settings beneath — DM Serif Display title (drift fix
// from font-semibold), section eyebrows that match Home and Routine, ghost sign-out so
// it doesn't compete with the rest of the page.
export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const { theme, colors: themeColors, mode, setMode } = useTheme();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [showRestartHint, setShowRestartHint] = useState(false);

  const displayName =
    typeof user?.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : t('profile.memberFallback');

  const email = user?.email ?? t('profile.previewAccount');
  const initial = (displayName ?? 'N').trim().charAt(0).toUpperCase() || 'N';

  const stats: { id: string; labelKey: string; value: string }[] = [
    { id: 'scans', labelKey: 'profile.statScans', value: '1' },
    { id: 'routine', labelKey: 'profile.statRoutineDays', value: '3' },
    { id: 'products', labelKey: 'profile.statCheckedProducts', value: '0' },
  ];

  async function handleLanguagePress(next: Lang) {
    if (next === lang) return;
    await setLang(next);
    setShowRestartHint(next === 'ar');
  }

  async function handleThemePress(next: ThemeMode) {
    if (next === mode) return;
    await setMode(next);
  }

  async function handleSignOutPress() {
    setSigningOut(true);
    setSignOutError('');

    const { error } = await signOut();

    if (error) {
      setSignOutError(error.message);
      setSigningOut(false);
      return;
    }

    setSigningOut(false);
    router.replace('/(onboarding)');
  }

  return (
    <View className="flex-1 bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
      <SafeAreaView className="flex-1 bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={themeColors.surface}
        />

        <ScrollView
          style={{ flex: 1, backgroundColor: themeColors.surface }}
          contentContainerStyle={{ paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-10 pt-6">
            <Text
              className="text-deepMauve"
              style={{
                fontFamily: 'DMSerifDisplay-Regular',
                fontSize: 32,
                fontWeight: '400',
                lineHeight: 38,
                letterSpacing: -0.3,
              }}
            >
              {t('profile.title')}
            </Text>
            <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
              {t('profile.subtitle')}
            </Text>

            {/* Identity block sits on the Blush ground, no card — the serif initial does
              the visual work. Quieter than the previous white-card surface and frees the
              vertical rhythm for the settings section to feel like its own area. */}
            <View className="mt-7 flex-row items-center">
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: themeColors.surfaceElevated,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: themeColors.hairline,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'DMSerifDisplay-Regular',
                    fontSize: 28,
                    color: colors.brandRose,
                    lineHeight: 32,
                  }}
                >
                  {initial}
                </Text>
              </View>
              <View className="ml-4 flex-1">
                <Text
                  className="text-deepMauve"
                  style={{
                    fontFamily: 'DMSerifDisplay-Regular',
                    fontSize: 22,
                    lineHeight: 28,
                  }}
                >
                  {displayName}
                </Text>
                <Text className="mt-1 text-[13px] text-darkGray">{email}</Text>
                <Text
                  className="mt-2 text-brandRose"
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('profile.freePlan')}
                </Text>
              </View>
            </View>

            {/* Settings section: eyebrow + language inline-underline tabs (matches the
              Routine AM/PM pattern), so the same control vocabulary is used everywhere. */}
            <Text
              className="mt-8 mb-1 text-darkGray"
              style={{
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {t('profile.settingsTitle')}
            </Text>

            <Text className="mt-4 text-[15px] font-semibold text-deepMauve">
              {t('profile.languageLabel')}
            </Text>

            <View
              className="mt-2 flex-row"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: themeColors.hairline,
              }}
            >
              <ChoiceTab
                active={lang === 'en'}
                label={t('profile.languageEnglish')}
                onPress={() => handleLanguagePress('en')}
                themeColors={themeColors}
              />
              <ChoiceTab
                active={lang === 'ar'}
                label={t('profile.languageArabic')}
                onPress={() => handleLanguagePress('ar')}
                themeColors={themeColors}
              />
            </View>

            {showRestartHint ? (
              <Text className="mt-3 text-[13px] leading-5 text-darkGray">
                {t('profile.restartHint')}
              </Text>
            ) : null}

            <Text className="mt-6 text-[15px] font-semibold text-deepMauve">
              {t('profile.appearanceLabel')}
            </Text>

            <View
              className="mt-2 flex-row"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: themeColors.hairline,
              }}
            >
              <ChoiceTab
                active={mode === 'light'}
                label={t('profile.appearanceLight')}
                onPress={() => handleThemePress('light')}
                themeColors={themeColors}
              />
              <ChoiceTab
                active={mode === 'dark'}
                label={t('profile.appearanceDark')}
                onPress={() => handleThemePress('dark')}
                themeColors={themeColors}
              />
              <ChoiceTab
                active={mode === 'system'}
                label={t('profile.appearanceSystem')}
                onPress={() => handleThemePress('system')}
                themeColors={themeColors}
              />
            </View>

            <Text className="mt-3 text-[13px] leading-5 text-darkGray">
              {t('profile.appearanceHint')}
            </Text>

            {/* Stats block: serif numerals replace the bold sans figures — same typographic
              voice as the Routine step ordinals (01 / 02 / 03), giving numbers a consistent
              identity across the app. */}
            <Text
              className="mt-8 mb-3 text-deepMauve"
              style={{
                fontFamily: 'DMSerifDisplay-Regular',
                fontSize: 20,
                lineHeight: 26,
              }}
            >
              {t('profile.statsTitle')}
            </Text>
            <View>
              {stats.map((stat, idx) => (
                <View
                  key={stat.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    paddingVertical: 14,
                    borderBottomWidth: idx < stats.length - 1 ? 1 : 0,
                    borderBottomColor: themeColors.hairlineSoft,
                  }}
                >
                  <Text className="text-[14px] text-darkGray">{t(stat.labelKey)}</Text>
                  <Text
                    style={{
                      fontFamily: 'DMSerifDisplay-Regular',
                      fontSize: 22,
                      color: colors.brandRose,
                      lineHeight: 26,
                      letterSpacing: 0.3,
                    }}
                  >
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Entry point into the scan history sub-route. Sits directly beneath the
              stats block so "Scans: 1" → "View all scans →" reads as one thought. */}
            <Pressable
              onPress={() => router.push('/(tabs)/scan-history')}
              accessibilityRole="button"
              className="mt-3 self-start active:opacity-60"
              style={{ paddingVertical: 8, paddingRight: 8 }}
            >
              <Text className="text-[14px] font-medium text-brandRose">
                {t('profile.viewAllScans')} →
              </Text>
            </Pressable>

            {/* Derm reassurance: gold tracked eyebrow + small body. Replaces the white
              card with a quieter inline treatment so the page doesn't end on a chrome note. */}
            <View
              className="mt-7 p-4 rounded-2xl"
              style={{
                backgroundColor: 'rgba(201, 168, 76, 0.08)',
                borderWidth: 1,
                borderColor: 'rgba(201, 168, 76, 0.35)',
              }}
            >
              <Text
                style={{
                  color: colors.gold,
                  fontSize: 11,
                  fontWeight: '600',
                  letterSpacing: 1.8,
                  textTransform: 'uppercase',
                }}
              >
                {t('profile.dermEyebrow')}
              </Text>
              <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
                {t('profile.dermBody')}
              </Text>
            </View>

            {signOutError ? (
              <View
                className="mt-5 rounded-2xl p-4"
                style={{
                  backgroundColor: 'rgba(199, 74, 96, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(199, 74, 96, 0.35)',
                }}
              >
                <Text style={{ color: colors.error, fontSize: 14, lineHeight: 20 }}>
                  {signOutError}
                </Text>
              </View>
            ) : null}

            {/* Sign-out is destructive but rare — render as a quiet ghost link so it
              doesn't visually fight with the main page content. */}
            <Pressable
              className="mt-8 self-center px-4 py-2 active:opacity-60"
              onPress={handleSignOutPress}
              disabled={signingOut}
              accessibilityRole="button"
            >
              {signingOut ? (
                <ActivityIndicator color={colors.brandRose} />
              ) : (
                <Text className="text-[14px] font-medium text-brandRose">
                  {t('profile.signOut')}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Inline-underline language tab — same control vocabulary as the Routine AM/PM tabs.
function ChoiceTab({
  active,
  label,
  onPress,
  themeColors,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  themeColors: ThemeColors;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        marginRight: 24,
        paddingBottom: 10,
        marginBottom: -1,
        borderBottomWidth: active ? 2 : 0,
        borderBottomColor: themeColors.brandRose,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: active ? '600' : '500',
          color: active ? themeColors.brandRose : themeColors.ink,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
