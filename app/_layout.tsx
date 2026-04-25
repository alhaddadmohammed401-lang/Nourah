import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    // Let's assume for now that if they don't have a session, 
    // we want them to go through onboarding and then signup/login.
    // Usually, unauthenticated users go to login. 
    // In Nourah, onboarding is the first step.
    if (!session && !inAuthGroup && !inOnboardingGroup) {
      // Not logged in and trying to access tabs/protected routes
      router.replace('/(onboarding)');
    } else if (session && (inAuthGroup || inOnboardingGroup)) {
      // Logged in but sitting on auth or onboarding screens
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="(onboarding)"
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
