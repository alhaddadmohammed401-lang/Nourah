// Extracts and verifies the calling user's Supabase JWT. Returns the user_id (uuid).
// Returns null if the request is unauthenticated; callers respond with errorResponse('UNAUTHENTICATED').
//
// We rely on Supabase Edge's automatic JWT verification (configured per-function via
// verify_jwt = true in supabase/config.toml). When that flag is on, the runtime injects
// the decoded payload into the Authorization header context. We still need to decode
// the JWT here to read `sub` (the user id).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export async function requireUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('Authorization') ?? req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) {
    console.error('SUPABASE_URL / SUPABASE_ANON_KEY missing in edge runtime');
    return null;
  }

  // Use an anon-key client just to call auth.getUser() which validates the JWT.
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user?.id) return null;
  return data.user.id;
}
