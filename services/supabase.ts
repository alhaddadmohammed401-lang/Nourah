import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Get keys from environment variables or provide clear instructions if missing
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client only if we have keys, otherwise provide a dummy client
// This prevents the app from crashing while the user sets up their Supabase project
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing. Please add EXPO_PUBLIC_SUPABASE_URL ' +
    'and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file to enable database features.'
  );
}
