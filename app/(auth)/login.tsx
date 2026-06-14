// TODO(i18n): Pre-auth surface. Migrate strings to useLanguage().t() and the locales
// dictionary on the next touch. Login is shown to returning users only.
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { signIn, signInWithGoogle } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';
import { GoogleButton } from '../../components/auth/GoogleButton';
import { type ThemeColors } from '../../constants/colors';
import { useTheme } from '../../hooks/useTheme';

// Polished login screen. Replaces the previous bold-sans "Welcome back" title with a
// DM Serif Display headline that matches the rest of the app, lighter input borders
// (Dusty-Pink hairline rather than mid-gray), and a quieter footer pairing the sign-up
// link with the primary button below. All colors source from constants/colors so brand
// changes propagate from one place.
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { theme, colors } = useTheme();

  // Belt-and-suspenders forward-redirect: if a session lands on this screen (e.g. from
  // a Google OAuth round-trip where Supabase redirected us back here so the auth guard
  // could pick up the URL-fragment tokens), bail out to the tabs immediately. The root
  // _layout guard does this too, but having a local effect makes the OAuth handoff
  // resilient to race conditions between fragment parsing and segment-based routing.
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: oauthError } = await signInWithGoogle();
    setGoogleLoading(false);
    if (oauthError) {
      setError(oauthError.message);
      return;
    }
    // On web, signInWithOAuth triggers a full-page redirect to Google — code after this
    // point doesn't run until after the round-trip lands back at our origin. On native,
    // openAuthSessionAsync resolved successfully, so we can navigate forward immediately.
    if (Platform.OS !== 'web') {
      router.replace('/(tabs)');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  const disabled = loading || !email || !password;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 56 }}>
          <Text
            style={{
              color: colors.inkSecondary,
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Welcome back
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: colors.ink,
              fontFamily: 'DMSerifDisplay-Regular',
              fontSize: 36,
              lineHeight: 42,
              letterSpacing: -0.3,
            }}
          >
            Pick up where you{'\n'}left off.
          </Text>
          <Text style={{ marginTop: 10, color: colors.inkSecondary, fontSize: 14, lineHeight: 22 }}>
            Sign in to continue your skincare reading.
          </Text>

          {error ? (
            <View
              style={{
                marginTop: 24,
                padding: 12,
                borderRadius: 12,
                backgroundColor: 'rgba(199, 74, 96, 0.08)',
                borderWidth: 1,
                borderColor: 'rgba(199, 74, 96, 0.35)',
              }}
            >
              <Text style={{ color: colors.error, fontSize: 14, lineHeight: 20 }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ marginTop: 28 }}>
            <Field label="Email" colors={colors}>
              <TextInput
                placeholder="hello@example.com"
                placeholderTextColor={colors.inkMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                style={inputStyle(colors)}
              />
            </Field>
          </View>

          <View style={{ marginTop: 16 }}>
            <Field label="Password" colors={colors}>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={colors.inkMuted}
                secureTextEntry
                autoComplete="current-password"
                value={password}
                onChangeText={setPassword}
                style={inputStyle(colors)}
              />
            </Field>
          </View>

          <Pressable
            style={({ pressed }) => ({
              marginTop: 32,
              height: 54,
              backgroundColor: disabled
                ? 'rgba(232, 99, 122, 0.45)'
                : pressed
                ? '#D4547A'
                : colors.brandRose,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            })}
            onPress={handleLogin}
            disabled={disabled}
          >
            <Text
              style={{
                color: colors.inkOnAccent,
                fontSize: 16,
                fontWeight: '600',
                letterSpacing: 0.4,
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Text>
          </Pressable>

          {/* Divider + Google CTA mirrors the signup screen so the auth pair feels
              symmetric. Loading state is wired separately from the email-password flow so
              tapping Google doesn't dim the primary button. */}
          <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
            <Text
              style={{
                marginHorizontal: 12,
                fontSize: 12,
                color: colors.inkSecondary,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              or
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
          </View>

          <View style={{ marginTop: 16 }}>
            <GoogleButton onPress={handleGoogle} loading={googleLoading} />
          </View>

          <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: colors.inkSecondary, fontSize: 13 }}>New here? </Text>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <Text style={{ color: colors.brandRose, fontSize: 13, fontWeight: '600' }}>
                Create an account
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ThemeColors;
}) {
  return (
    <View>
      <Text
        style={{
          color: colors.ink,
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function inputStyle(colors: ThemeColors) {
  return {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.ink,
  } as const;
}
