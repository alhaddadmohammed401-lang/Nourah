import { supabase } from './supabase';
import { setMockUser, type MockUser } from './mockAuthStore';

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

export const signInWithGoogle = async () => {
  if (!supabase) {
    return { error: { message: 'Supabase not initialized' } };
  }

  // Google OAuth requires expo-auth-session and platform specific client IDs. This is a
  // placeholder for the Google Auth implementation in a future craft run.
  return { error: { message: 'Google Auth not yet implemented' } };
};
