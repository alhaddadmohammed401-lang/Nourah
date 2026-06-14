// TODO(i18n): Pre-auth surface. Migrate strings to useLanguage().t() and the locales
// dictionary on the next touch. Onboarding is shown once per lifetime, so leaving it
// English for now is acceptable while Profile carries the language toggle.
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useTheme } from '../../hooks/useTheme';

const PROMISE_TAGS = ['Halal-aware', 'GCC climate', 'AI-powered'];

// First moment of the app. PRODUCT.md positions Nourah's identity as warm, confident,
// modern — "Flo crossed with Glossier." Polish theme: bilingual logotype + calm promise.
// The previous gold-rule-with-eyebrow ornament and the white features card both read as
// chrome on top of the serif logotype; this version puts the logotype first, surrounds
// it with breathing room, and lets the promise tags sit as quiet inline chips on the
// Blush ground instead of inside a card surface.
export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const { theme, colors: themeColors } = useTheme();

  function handleGetStartedPress() {
    router.push('/(onboarding)/concerns');
  }

  return (
    <SafeAreaView className="flex-1 bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.surface}
      />

      <View className="flex-1 px-7 pt-16">
        <Text
          className="text-darkGray"
          style={{
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Skincare intelligence
        </Text>

        <Text
          className="mt-5 text-brandRose"
          style={{
            fontFamily: 'DMSerifDisplay-Regular',
            fontSize: 56,
            lineHeight: 60,
            letterSpacing: -1,
          }}
        >
          Nourah
        </Text>
        <Text
          className="mt-1 text-gold"
          style={{
            fontFamily: 'DMSerifDisplay-Regular',
            fontSize: 26,
            lineHeight: 30,
            letterSpacing: 0.2,
          }}
        >
          نورة
        </Text>

        <View
          style={{
            width: 36,
            height: 2,
            backgroundColor: colors.brandRose,
            opacity: 0.6,
            marginTop: 20,
            borderRadius: 1,
          }}
        />

        <Text
          className="mt-6 text-deepMauve"
          style={{
            fontFamily: 'DMSerifDisplay-Regular',
            fontSize: 28,
            lineHeight: 34,
            letterSpacing: -0.2,
          }}
        >
          Your skin, understood.
        </Text>
        <Text className="mt-3 text-[15px] leading-[24px] text-darkGray" style={{ maxWidth: 320 }}>
          AI-powered skincare for GCC skin: halal-aware ingredients, climate-smart
          routines, and a reading you can trust.
        </Text>

        <View className="mt-6 flex-row flex-wrap">
          {PROMISE_TAGS.map((label) => (
            <View
              key={label}
              className="mr-2 mt-2 rounded-full px-3 py-1.5"
              style={{
                borderWidth: 1,
                borderColor: themeColors.hairline,
              }}
            >
              <Text className="text-[12px] font-medium text-deepMauve" style={{ letterSpacing: 0.2 }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-7 pb-8">
        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-brandRose active:bg-dustyPink active:opacity-90"
          onPress={handleGetStartedPress}
          accessibilityRole="button"
        >
          <Text className="text-[17px] font-semibold text-white" style={{ letterSpacing: 0.4 }}>
            Get started
          </Text>
        </Pressable>

        <View className="mt-5 flex-row items-center justify-center">
          <Text className="text-[13px] text-darkGray">Already have an account? </Text>
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="link"
            accessibilityLabel="Sign in"
          >
            <Text className="text-[13px] font-semibold text-brandRose">Sign in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
