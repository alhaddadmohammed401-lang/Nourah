import { useRouter } from 'expo-router';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function OnboardingWelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9E8E8" />

      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Content */}
      <View style={styles.content}>
        {/* Gold accent */}
        <View style={styles.accentRow}>
          <View style={styles.accentLine} />
          <Text style={styles.accentLabel}>skincare intelligence</Text>
          <View style={styles.accentLine} />
        </View>

        {/* App name */}
        <Text style={styles.appName}>Nourah</Text>
        <Text style={styles.arabicName}>نورة</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Your skin, understood.</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description card */}
        <View style={styles.card}>
          <Text style={styles.description}>
            AI-powered skincare guidance for GCC skin, halal-aware ingredients,
            and climate-smart routines.
          </Text>

          {/* Feature pills */}
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillEmoji}>🌙</Text>
              <Text style={styles.pillText}>Halal-aware</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillEmoji}>☀️</Text>
              <Text style={styles.pillText}>GCC climate</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillEmoji}>✨</Text>
              <Text style={styles.pillText}>AI-powered</Text>
            </View>
          </View>
        </View>

        {/* Bilingual line */}
        <Text style={styles.bilingualLine}>Arabic + English skincare intelligence</Text>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={() => router.push('/(onboarding)/concerns')}
        >
          <Text style={styles.ctaText}>Get Started</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>

        <Text style={styles.loginHint}>
          Already have an account?{' '}
          <Text style={styles.loginLink}>Sign in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9E8E8',
  },

  // Decorative blobs
  blobTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E8637A',
    opacity: 0.1,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#D4A0A7',
    opacity: 0.12,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: height * 0.08,
    alignItems: 'center',
  },

  // Gold accent row
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  accentLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C9A84C',
    opacity: 0.5,
  },
  accentLabel: {
    fontSize: 11,
    color: '#C9A84C',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginHorizontal: 10,
  },

  // App name
  appName: {
    fontSize: 52,
    fontWeight: '300',
    color: '#E8637A',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 2,
  },
  arabicName: {
    fontSize: 20,
    color: '#C9A84C',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 2,
  },

  // Tagline
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D1B2E',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 20,
  },

  // Divider
  divider: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E8637A',
    marginBottom: 24,
    opacity: 0.6,
  },

  // Description card
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#2D1B2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    color: '#5A5A5A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 18,
  },

  // Feature pills
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9E8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8C8C8',
    margin: 4,
  },
  pillEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  pillText: {
    fontSize: 12,
    color: '#2D1B2E',
    fontWeight: '500',
  },

  // Bilingual
  bilingualLine: {
    fontSize: 13,
    color: '#D4A0A7',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Footer / CTA
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 32,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#E8637A',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8637A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonPressed: {
    backgroundColor: '#D4556C',
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  ctaArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loginHint: {
    fontSize: 13,
    color: '#5A5A5A',
    marginTop: 16,
  },
  loginLink: {
    color: '#E8637A',
    fontWeight: '600',
  },
});
