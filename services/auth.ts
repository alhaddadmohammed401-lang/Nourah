import { supabase } from './supabase';

export const signUp = async (
  email: string,
  password: string,
  name?: string,
  phone?: string,
) => {
  if (!supabase) {
    console.warn('Supabase not initialized. Returning mock success.');
    return { data: { user: { id: 'mock-user-id' } }, error: null };
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
    console.warn('Supabase not initialized. Returning mock success.');
    return { data: { user: { id: 'mock-user-id' }, session: {} }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signInWithGoogle = async () => {
  if (!supabase) {
    console.warn('Supabase not initialized.');
    return { error: { message: 'Supabase not initialized' } };
  }

  // Google OAuth requires expo-auth-session and platform specific client IDs.
  // This is a placeholder for the Google Auth implementation.
  console.log('Google Auth not yet implemented.');
  return { error: { message: 'Google Auth not yet implemented' } };
};
