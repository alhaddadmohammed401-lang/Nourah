// useProfile — fetches the signed-in user's public.profiles row once per mount and
// returns it. Mirrors usePremiumStatus.ts's shape so the call site is symmetric.
//
// Used by the barcode scanner result sheet to personalize the recommended / avoid
// sections against the user's skin_type and concerns. When there's no user, no
// Supabase client, or the profile row doesn't exist yet, `profile` stays null and the
// caller should hide the personalization sections.

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getProfile, type Profile } from '../services/profileService';

export function useProfile(): { profile: Profile | null; loading: boolean } {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    void getProfile(user.id).then((result) => {
      if (cancelled) return;
      setProfile(result.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { profile, loading };
}
