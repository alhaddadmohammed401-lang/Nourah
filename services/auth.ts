import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';
import { setMockUser, type MockUser } from './mockAuthStore';
import type { SkinType } from './profileService';

export type OnboardingAnswers = {
  skinType: SkinType;
  concerns: string[];
};

// In-app browser pre-warm: only matters on Android, where the first open of a Custom Tab
// is otherwise noticeably slower. No-op on iOS / web. Cheap to call repeatedly so we just
// fire it at module load.
if (Platform.OS !== 'web') {
  void WebBrowser.maybeCompleteAuthSession();
}

// When Supabase env vars are missing, a deterministic mock user is created so the rest
// of the app (AuthProvider, profile screen, auth guard) sees a real session shape. Once
// real env vars are supplied, this fallback never runs and the live client takes over.
function buildMockUser(email: string, name?: string, phone?: string): MockUser {
  return {
    id: `mock-${email.toLowerCase()}`,
    email,
    user_metadata: {
      name: name ?? email.split('@')[0],
      phone: phone ?? null,
    },
  };
}

export const signUp = async (
  email: string,
  password: string,
  name?: string,
  phone?: string,
  onboarding?: OnboardingAnswers,
) => {
  if (!supabase) {
    const user = buildMockUser(email, name, phone);
    await setMockUser(user);
    return { data: { user }, error: null };
  }

  // Phone is stored in user_metadata until Twilio OTP is wired in a later craft run.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
        ...(onboarding
          ? {
              skin_type: onboarding.skinType,
              concerns: onboarding.concerns,
            }
          : {}),
      },
    },
  });

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    const user = buildMockUser(email);
    await setMockUser(user);
    return { data: { user, session: { user } }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    await setMockUser(null);
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signInWithGoogle = async (): Promise<{ error: { message: string } | null }> => {
  if (!supabase) {
    return { error: { message: 'Supabase not initialized' } };
  }

  // Web vs. native take two different paths even though both end at the same Supabase
  // session:
  //
  //   - Web: supabase-js does a `window.location` redirect to Google, Google redirects
  //     to Supabase's callback URL, and Supabase finally redirects back to our origin
  //     with the tokens in the URL fragment. `detectSessionInUrl: true` (set in
  //     services/supabase.ts) parses that fragment automatically on the next load.
  //
  //   - Native: we can't trigger a top-level navigation, so we ask supabase-js to BUILD
  //     the OAuth URL but skip the redirect (`skipBrowserRedirect: true`), open it in an
  //     in-app browser via expo-web-browser, intercept the final redirect to our app's
  //     deep link, then manually exchange the returned tokens for a session via
  //     `setSession`. The redirect URL must be in the Supabase project's allowlist
  //     (Authentication → URL Configuration → Redirect URLs): `nourah://auth/callback`.
  if (Platform.OS === 'web') {
    // We deliberately return to /login (the (auth) group) rather than `/` so the
    // expo-router auth guard in app/_layout.tsx sees `inAuthGroup === true` while
    // supabase-js is still parsing tokens out of the URL fragment. Without this, the
    // guard fires on `/` with session still null, redirects to (onboarding), and the
    // hash fragment gets stripped before detectSessionInUrl can consume it.
    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: redirectTo ? { redirectTo } : undefined,
    });
    return { error: error ? { message: error.message } : null };
  }

  // Native flow.
  const redirectTo = Linking.createURL('auth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) return { error: { message: error.message } };
  if (!data?.url) return { error: { message: 'Could not build OAuth URL' } };

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success' || !result.url) {
    // type === 'cancel' / 'dismiss' / 'locked' — user closed the sheet. Not an error to
    // surface as a banner; the screen just returns to its idle state.
    return { error: { message: 'Sign-in was cancelled' } };
  }

  // Tokens can come back either in the fragment (#access_token=...) for implicit flow or
  // as query params (?code=...) for PKCE — Supabase defaults to implicit on signInWithOAuth
  // unless the project is configured for PKCE. We try the fragment first; if that's empty,
  // we fall back to exchanging an auth `code` via exchangeCodeForSession.
  const url = new URL(result.url);
  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  const fragment = new URLSearchParams(hash);
  const accessToken = fragment.get('access_token');
  const refreshToken = fragment.get('refresh_token');

  if (accessToken && refreshToken) {
    const { error: setError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return { error: setError ? { message: setError.message } : null };
  }

  const code = url.searchParams.get('code');
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    return { error: exchangeError ? { message: exchangeError.message } : null };
  }

  return {
    error: { message: 'Sign-in completed but no tokens were returned' },
  };
};
