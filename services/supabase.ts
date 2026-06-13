import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Get keys from environment variables or provide clear instructions if missing
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client only if we have keys, otherwise provide a dummy client
// This prevents the app from crashing while the user sets up their Supabase project.
//
// Auth config notes:
//   - storage: native (iOS/Android) has no localStorage, so without an explicit
//     AsyncStorage adapter the session is kept in memory only and the user gets logged
//     out on every reload. On web we leave it undefined so supabase-js uses its default
//     localStorage adapter, which it does correctly.
//   - autoRefreshToken: silently refresh JWTs as they expire so long sessions don't
//     hard-fail mid-task.
//   - persistSession: write the session back to storage so reopening the app restores it.
//   - detectSessionInUrl: only true on web — needed so OAuth redirects (when we add
//     Google sign-in) can finish the handshake by reading the access token from the URL
//     fragment. No-op on native.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    })
  : null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing. Please add EXPO_PUBLIC_SUPABASE_URL ' +
    'and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file to enable database features.'
  );
}
