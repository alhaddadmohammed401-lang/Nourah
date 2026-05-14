// TODO(i18n): Pre-auth surface. Migrate strings to useLanguage().t() and the locales
// dictionary on the next touch. Onboarding is shown once per lifetime, so leaving it
// English for now is acceptable while Profile carries the language toggle.
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

type WelcomeFeature = {
  label: string;
};

const WELCOME_FEATURES: WelcomeFeature[] = [
  { label: 'Halal-aware' },
  { label: 'GCC climate' },
  { label: 'AI-powered' },
];

// Shows the first onboarding screen and introduces the app before collecting skin concerns.
export default function OnboardingWelcomeScreen() {
  const router = useRouter();

  // Moves the user to the next onboarding step when they press the main CTA.
  function handleGetStartedPress() {
    router.push('/(onboarding)/concerns');
  }

  return (
    <SafeAreaView className="flex-1 bg-softBlush">
      <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

      <View className="flex-1 items-center px-7 pt-16">
        <View className="mb-5 w-full flex-row items-center">
          <View className="h-px flex-1 bg-gold opacity-50" />
          <Text className="mx-3 text-xs font-medium uppercase text-gold">
            skincare intelligence
          </Text>
          <View className="h-px flex-1 bg-gold opacity-50" />
        </View>

        <Text className="text-center text-[40px] font-light text-brandRose">
          Nourah
        </Text>
        <Text className="mb-4 text-center text-xl font-medium text-gold">
          نورة
        </Text>

        <Text className="mb-5 text-center text-2xl font-bold text-deepMauve">
          Your skin, understood.
        </Text>

        <View className="mb-6 h-1 w-12 rounded-full bg-brandRose opacity-60" />

        <View className="mb-6 w-full rounded-2xl bg-white p-6 shadow-sm">
          <Text className="mb-5 text-center text-base leading-6 text-darkGray">
            AI-powered skincare guidance for GCC skin, halal-aware ingredients,
            and climate-smart routines.
          </Text>

          <View className="flex-row flex-wrap justify-center">
            {WELCOME_FEATURES.map((feature) => (
              <View
                key={feature.label}
                className="m-1 rounded-full border border-lightGray bg-softBlush px-3 py-2"
              >
                <Text className="text-sm font-medium text-deepMauve">
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text className="text-center text-sm text-dustyPink">
          Arabic + English skincare intelligence
        </Text>
      </View>

      <View className="items-center px-7 pb-8">
        <Pressable
          className="h-14 w-full flex-row items-center justify-center rounded-xl bg-brandRose active:bg-dustyPink active:opacity-90"
          onPress={handleGetStartedPress}
        >
          <Text className="text-lg font-bold text-white">Get Started</Text>
          <Text className="ml-2 text-lg font-semibold text-white">→</Text>
        </Pressable>

        <View className="mt-4 flex-row">
          <Text className="text-sm text-darkGray">Already have an account? </Text>
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="link"
            accessibilityLabel="Sign in"
          >
            <Text className="text-sm font-semibold text-brandRose">Sign in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
