// In-memory + AsyncStorage backed mock auth state. Only used when Supabase env vars are
// missing (preview/dev). Lets AuthProvider observe sign-in/sign-up without a real session,
// so the auth guard in app/_layout.tsx doesn't bounce the user back to onboarding the
// moment they "sign in" against the fallback.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'nourah:mock-auth';

export type MockUser = {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
};

let current: MockUser | null = null;
const listeners = new Set<(user: MockUser | null) => void>();

// Hydrates the in-memory cache from AsyncStorage; called once by AuthProvider on mount
// so the user stays signed in across reloads while developing.
export async function hydrateMockUser(): Promise<MockUser | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      current = null;
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as MockUser).id === 'string' &&
      typeof (parsed as MockUser).email === 'string'
    ) {
      current = parsed as MockUser;
      return current;
    }
  } catch {
    // Treat any parse / storage failure as no signed-in user.
  }

  current = null;
  return null;
}

export function getMockUser(): MockUser | null {
  return current;
}

export async function setMockUser(next: MockUser | null): Promise<void> {
  current = next;
  try {
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Persistence failure is non-fatal; in-memory state still drives the session.
  }
  listeners.forEach((listener) => listener(next));
}

export function subscribeMockUser(listener: (user: MockUser | null) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
