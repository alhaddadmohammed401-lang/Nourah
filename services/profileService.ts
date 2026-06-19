// profileService — reads/writes public.profiles. Used by the onboarding flow and the
// Profile tab. When Supabase env vars are missing, every call returns a no-op result
// instead of throwing so the mock-auth dev experience keeps working.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
export type AppLocale = 'ar' | 'en';

export type Profile = {
  id: string;
  name: string | null;
  phone: string | null;
  skin_type: SkinType | null;
  concerns: string[];
  locale: AppLocale;
  created_at: string;
  updated_at: string;
};

export type ProfilePatch = Partial<
  Pick<Profile, 'name' | 'phone' | 'skin_type' | 'concerns' | 'locale'>
>;

export type ProfileResult = { data: Profile | null; error: string | null };

export async function getProfile(userId: string): Promise<ProfileResult> {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return { data: (data as Profile) ?? null, error: error?.message ?? null };
}

export async function updateProfile(
  userId: string,
  patch: ProfilePatch,
): Promise<ProfileResult> {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select()
    .single();
  return { data: (data as Profile) ?? null, error: error?.message ?? null };
}

const PENDING_ONBOARDING_KEY = 'nourah:pending-onboarding';

// Convenience: called immediately after signup to persist onboarding answers into the
// profile row that the on_auth_user_created trigger just created.
export async function saveOnboardingAnswers(
  userId: string,
  answers: { skinType?: string; concerns?: string[] },
): Promise<ProfileResult> {
  const patch: ProfilePatch = {};
  if (answers.skinType) patch.skin_type = answers.skinType as SkinType;
  if (answers.concerns && answers.concerns.length > 0) patch.concerns = answers.concerns;
  if (Object.keys(patch).length === 0) return { data: null, error: null };
  
  const result = await updateProfile(userId, patch);
  if (!result.error) {
    try {
      await AsyncStorage.removeItem(PENDING_ONBOARDING_KEY);
    } catch {
      // Ignored
    }
  }
  return result;
}

export async function savePendingOnboardingLocal(answers: {
  skinType?: string;
  concerns?: string[];
}): Promise<void> {
  try {
    await AsyncStorage.setItem(PENDING_ONBOARDING_KEY, JSON.stringify(answers));
  } catch (error) {
    console.warn('Failed to save pending onboarding locally:', error);
  }
}

export async function persistPendingOnboardingToServer(userId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_ONBOARDING_KEY);
    if (!raw) return;
    const answers = JSON.parse(raw) as { skinType?: string; concerns?: string[] };
    if (answers && (answers.skinType || answers.concerns)) {
      const { error } = await saveOnboardingAnswers(userId, answers);
      if (!error) {
        await AsyncStorage.removeItem(PENDING_ONBOARDING_KEY);
      }
    }
  } catch (error) {
    console.warn('Failed to persist pending onboarding to server:', error);
  }
}
