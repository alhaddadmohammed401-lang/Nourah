// Service-role Supabase client. RLS bypassed. Use only inside edge functions for writes
// that need to skip user policies (inserting scans, upserting subscriptions, etc.).
//
// The environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected
// automatically by the Supabase Edge runtime — they are NOT something we set.

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in edge runtime');
  }
  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
