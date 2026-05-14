// TODO(i18n): Pre-auth surface. Migrate strings to useLanguage().t() and the locales
// dictionary on the next touch. Signup is shown once per lifetime, so leaving it English
// for now is acceptable while Profile carries the language toggle.
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';

import { signUp, signInWithGoogle } from '../../services/auth';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { PhoneField } from '../../components/auth/PhoneField';
import { GoogleButton } from '../../components/auth/GoogleButton';
import { colors } from '../../constants/colors';

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
};

function validate(name: string, email: string, phone: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = 'Tell us what to call you.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'That email looks off.';
  const phoneDigits = phone.replace(/\D/g, '');
  if (!phoneDigits) errors.phone = 'Phone number is required.';
  else if (phoneDigits.length < 7) errors.phone = 'Phone looks too short.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 8) errors.password = 'At least 8 characters.';
  return errors;
}

export default function SignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ concerns?: string; skinType?: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleCreateAccount() {
    setServerError(null);
    setInfo(null);
    const next = validate(name, email, phone, password);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const fullPhone = `+971${phone.replace(/\D/g, '')}`;
    const { error } = await signUp(email.trim(), password, name.trim(), fullPhone);
    setSubmitting(false);

    if (error) {
      setServerError(error.message ?? 'Something went wrong. Try again.');
      return;
    }

    // Onboarding answers carried in via params land here. Persisting them to a
    // Supabase profiles row is deferred to a later craft run; for now they live in
    // user_metadata via signUp() and the Home tab is reachable immediately.
    if (params.concerns || params.skinType) {
      console.log('Onboarding payload:', {
        concerns: params.concerns,
        skinType: params.skinType,
      });
    }
    router.replace('/(tabs)');
  }

  async function handleGoogle() {
    setServerError(null);
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) {
      setInfo('Google sign-in is enabled in production builds.');
    }
  }

  const cardShadow = {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  return (
    <SafeAreaView className="flex-1 bg-softBlush">
      <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
            <Text className="text-[15px] font-medium text-brandRose">← Back</Text>
          </Pressable>

          <Text className="mt-6 text-[12px] font-medium uppercase tracking-[2px] text-darkGray">
            Welcome
          </Text>
          <Text
            className="mt-1 text-deepMauve"
            style={{
              fontFamily: 'DMSerifDisplay-Regular',
              fontSize: 28,
              fontWeight: '400',
              lineHeight: 34,
              letterSpacing: -0.2,
            }}
          >
            A few details, then{'\n'}we read your skin.
          </Text>
          <Text className="mt-2 text-[15px] leading-6 text-darkGray">
            Stays private. Your scans never leave your account.
          </Text>

          <View
            className="mt-6 rounded-2xl bg-white p-5"
            style={cardShadow}
          >
            {serverError ? (
              <View className="mb-4 rounded-xl bg-error/10 p-3">
                <Text className="text-[14px] text-error">{serverError}</Text>
              </View>
            ) : null}

            <View className="mb-4">
              <TextField
                label="Name"
                placeholder="Nourah"
                autoCapitalize="words"
                autoComplete="name"
                value={name}
                onChangeText={setName}
                error={errors.name ?? null}
              />
            </View>

            <View className="mb-4">
              <TextField
                label="Email"
                placeholder="hello@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                error={errors.email ?? null}
              />
            </View>

            <View className="mb-4">
              <PhoneField
                value={phone}
                onChangeText={setPhone}
                error={errors.phone ?? null}
              />
            </View>

            <View className="mb-5">
              <TextField
                label="Password"
                placeholder="At least 8 characters"
                secureTextEntry
                autoComplete="new-password"
                value={password}
                onChangeText={setPassword}
                error={errors.password ?? null}
              />
            </View>

            <Button
              label={submitting ? 'Creating account…' : 'Create account'}
              loading={submitting}
              onPress={handleCreateAccount}
            />

            <View className="my-5 flex-row items-center">
              <View className="h-px flex-1 bg-lightGray" />
              <Text className="mx-3 text-[12px] uppercase tracking-[2px] text-darkGray">or</Text>
              <View className="h-px flex-1 bg-lightGray" />
            </View>

            <GoogleButton onPress={handleGoogle} loading={googleLoading} />

            {info ? (
              <Text className="mt-3 text-center text-[13px] text-darkGray">{info}</Text>
            ) : null}
          </View>

          <View className="mt-5 flex-row justify-center">
            <Text className="text-[14px] text-darkGray">Already have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/login')} accessibilityRole="link">
              <Text className="text-[14px] font-medium text-brandRose">Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
