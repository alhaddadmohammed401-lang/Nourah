// subscriptionService — reads the user's premium status from public.subscriptions.
// Writes happen exclusively from the revenuecat-webhook edge function.

import { supabase } from './supabase';

export type Subscription = {
  user_id: string;
  is_premium: boolean;
  entitlement: string | null;
  expires_at: string | null;
  last_event: string | null;
  updated_at: string;
};

export async function getPremiumStatus(userId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase
    .from('subscriptions')
    .select('is_premium')
    .eq('user_id', userId)
    .maybeSingle();
  return !!data?.is_premium;
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return (data as Subscription) ?? null;
}
