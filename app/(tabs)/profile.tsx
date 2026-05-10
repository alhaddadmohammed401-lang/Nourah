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
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/auth';

type ProfileStat = {
  id: string;
  labelEn: string;
  labelAr: string;
  value: string;
};

const PROFILE_STATS: ProfileStat[] = [
  { id: 'scans', labelEn: 'Scans', labelAr: 'الفحوصات', value: '1' },
  { id: 'routine', labelEn: 'Routine days', labelAr: 'أيام الروتين', value: '3' },
  { id: 'products', labelEn: 'Checked products', labelAr: 'منتجات مفحوصة', value: '0' },
];

// Shows account state, soft progress stats, and a safe sign-out path.
export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  const displayName =
    typeof user?.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : 'Nourah member';

  const email = user?.email ?? 'Preview account';

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
    <SafeAreaView className="flex-1 bg-softBlush">
      <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

      <View className="flex-1 bg-softBlush">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 pb-10 pt-8">
            <Text className="text-[28px] font-semibold text-deepMauve">
              Profile
            </Text>
            <Text className="mt-1 text-[20px] leading-8 text-deepMauve">
              الملف الشخصي
            </Text>

            <View className="mt-6 rounded-2xl bg-white p-5">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-softLavender">
                <Text className="text-[24px] font-semibold text-brandRose">
                  N
                </Text>
              </View>

              <Text className="mt-5 text-[22px] font-semibold text-deepMauve">
                {displayName}
              </Text>
              <Text className="mt-2 text-[15px] text-darkGray">{email}</Text>

              <View className="mt-5 self-start rounded-full bg-softBlush px-4 py-2">
                <Text className="text-[13px] font-semibold text-brandRose">
                  Free plan | الخطة المجانية
                </Text>
              </View>
            </View>

            <View className="mt-5 rounded-2xl bg-white p-5">
              <Text className="text-[17px] font-semibold text-deepMauve">
                Your skin record
              </Text>
              <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                سجل بشرتك
              </Text>

              <View className="mt-5">
                {PROFILE_STATS.map((stat) => (
                  <View
                    key={stat.id}
                    className="mb-4 flex-row items-center justify-between border-b border-lightGray pb-4"
                  >
                    <View className="flex-1 pr-4">
                      <Text className="text-[15px] font-semibold text-deepMauve">
                        {stat.labelEn}
                      </Text>
                      <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                        {stat.labelAr}
                      </Text>
                    </View>
                    <Text className="text-[24px] font-semibold text-brandRose">
                      {stat.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="mt-5 rounded-2xl border border-gold bg-white p-5">
              <Text className="text-[13px] font-semibold uppercase text-gold">
                Dermatologist-backed
              </Text>
              <Text className="mt-3 text-[15px] leading-6 text-darkGray">
                Nourah is guided by quiet expertise from a licensed dermatologist in Dubai.
              </Text>
              <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                نورة مبنية على خبرة هادئة من طبيبة جلدية مرخصة في دبي.
              </Text>
            </View>

            {signOutError ? (
              <View className="mt-5 rounded-2xl border border-error bg-white p-4">
                <Text className="text-[14px] leading-5 text-error">
                  {signOutError}
                </Text>
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
                  Sign out
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
