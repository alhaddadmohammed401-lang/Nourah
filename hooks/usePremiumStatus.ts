// usePremiumStatus — single source of truth for "is this user premium" in the frontend.
// Reads from public.subscriptions via subscriptionService.getPremiumStatus(). RLS scopes
// the row to the signed-in user. Falls back to false when there's no user, no Supabase
// client, or no subscription row.

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getPremiumStatus } from '../services/subscriptionService';

export function usePremiumStatus(): { isPremium: boolean; loading: boolean } {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) {
      setIsPremium(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    void getPremiumStatus(user.id).then((result) => {
      if (cancelled) return;
      setIsPremium(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { isPremium, loading };
}
