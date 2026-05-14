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
import { colors } from '../../constants/colors';
import { GeneratedIcon } from '../../components/ui/GeneratedIcon';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import type { Lang } from '../../constants/locales';
import { signOut } from '../../services/auth';

const profileIcon = require('../../assets/icons/nourah-profile-icon.png');

// Settings + identity surface. Headlines the language toggle so the bilingual promise is
// always within reach. Sign-out lives at the bottom because it's the destructive path.
export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [showRestartHint, setShowRestartHint] = useState(false);

  const displayName =
    typeof user?.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : t('profile.memberFallback');

  const email = user?.email ?? t('profile.previewAccount');

  const stats: { id: string; labelKey: string; value: string }[] = [
    { id: 'scans', labelKey: 'profile.statScans', value: '1' },
    { id: 'routine', labelKey: 'profile.statRoutineDays', value: '3' },
    { id: 'products', labelKey: 'profile.statCheckedProducts', value: '0' },
  ];

  // Persists the chosen language and surfaces the restart hint when Arabic flips RTL,
  // since native layout direction only finalizes on a fresh JS load.
  async function handleLanguagePress(next: Lang) {
    if (next === lang) return;
    await setLang(next);
    setShowRestartHint(next === 'ar');
  }

  // Signs out through the auth service and returns the user to onboarding when complete.
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
    <View className="flex-1 bg-softBlush">
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 pb-10 pt-8">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-5">
                <Text className="text-[28px] font-semibold text-deepMauve">
                  {t('profile.title')}
                </Text>
                <Text className="mt-3 text-[15px] leading-6 text-darkGray">
                  {t('profile.subtitle')}
                </Text>
              </View>

              <View className="h-24 w-24 items-center justify-center rounded-2xl bg-white">
                <GeneratedIcon source={profileIcon} size="lg" />
              </View>
            </View>

            <View className="mt-6 rounded-2xl bg-white p-5">
              <View className="flex-row items-start">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-softLavender">
                  <Text className="text-[24px] font-semibold text-brandRose">N</Text>
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-[22px] font-semibold text-deepMauve">{displayName}</Text>
                  <Text className="mt-2 text-[15px] text-darkGray">{email}</Text>

                  <View className="mt-4 self-start rounded-full bg-softBlush px-4 py-2">
                    <Text className="text-[13px] font-semibold text-brandRose">
                      {t('profile.freePlan')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-5 rounded-2xl bg-white p-5">
              <Text className="text-[13px] font-semibold uppercase tracking-[2px] text-darkGray">
                {t('profile.settingsTitle')}
              </Text>

              <Text className="mt-4 text-[15px] font-semibold text-deepMauve">
                {t('profile.languageLabel')}
              </Text>

              <View className="mt-3 flex-row rounded-2xl border border-lightGray bg-softBlush p-1">
                <LangOption
                  active={lang === 'en'}
                  label={t('profile.languageEnglish')}
                  onPress={() => handleLanguagePress('en')}
                />
                <LangOption
                  active={lang === 'ar'}
                  label={t('profile.languageArabic')}
                  onPress={() => handleLanguagePress('ar')}
                />
              </View>

              {showRestartHint ? (
                <Text className="mt-3 text-[13px] leading-5 text-darkGray">
                  {t('profile.restartHint')}
                </Text>
              ) : null}
            </View>

            <View className="mt-5 rounded-2xl bg-white p-5">
              <Text className="text-[17px] font-semibold text-deepMauve">
                {t('profile.statsTitle')}
              </Text>

              <View className="mt-5">
                {stats.map((stat, idx) => (
                  <View
                    key={stat.id}
                    className={`flex-row items-center justify-between ${
                      idx < stats.length - 1 ? 'mb-4 border-b border-lightGray pb-4' : ''
                    }`}
                  >
                    <Text className="flex-1 pr-4 text-[15px] font-semibold text-deepMauve">
                      {t(stat.labelKey)}
                    </Text>
                    <Text className="text-[24px] font-semibold text-brandRose">{stat.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="mt-5 rounded-2xl border border-gold bg-white p-5">
              <Text className="text-[13px] font-semibold uppercase tracking-[2px] text-gold">
                {t('profile.dermEyebrow')}
              </Text>
              <Text className="mt-3 text-[15px] leading-6 text-darkGray">{t('profile.dermBody')}</Text>
            </View>

            {signOutError ? (
              <View className="mt-5 rounded-2xl border border-error bg-white p-4">
                <Text className="text-[14px] leading-5 text-error">{signOutError}</Text>
              </View>
            ) : null}

            <Pressable
              className="mt-7 h-[52px] items-center justify-center rounded-xl border border-brandRose bg-white active:bg-softBlush"
              onPress={handleSignOutPress}
              disabled={signingOut}
              accessibilityRole="button"
            >
              {signingOut ? (
                <ActivityIndicator color={colors.brandRose} />
              ) : (
                <Text className="text-[17px] font-semibold text-brandRose">
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

// Renders one segment of the language pill. Active is brandRose, inactive sits flat on
// the soft blush track so the unselected option still reads as a tappable choice rather
// than disappearing into the surface.
function LangOption({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`h-12 flex-1 items-center justify-center rounded-xl ${
        active ? 'bg-brandRose' : 'bg-transparent'
      }`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        className={`text-[15px] font-semibold ${active ? 'text-white' : 'text-deepMauve'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
