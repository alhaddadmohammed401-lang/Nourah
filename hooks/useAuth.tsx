import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import {
  hydrateMockUser,
  subscribeMockUser,
  type MockUser,
} from '../services/mockAuthStore';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

// Mock users are shaped to fit Supabase's User type for the parts the app reads (id,
// email, user_metadata). Casting through unknown keeps the surface honest about that.
function mockUserToSupabaseUser(mock: MockUser): User {
  return mock as unknown as User;
}

function mockUserToSession(mock: MockUser): Session {
  return { user: mockUserToSupabaseUser(mock) } as unknown as Session;
}

// Provides Supabase auth state to the rest of the app so screens can react to login
// changes. When env vars are missing, falls back to a local mock store so the auth
// guard still sees a real session after sign-in/sign-up against the fallback.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      let cancelled = false;

      (async () => {
        const hydrated = await hydrateMockUser();
        if (cancelled) return;

        if (hydrated) {
          setUser(mockUserToSupabaseUser(hydrated));
          setSession(mockUserToSession(hydrated));
        }
        setLoading(false);
      })();

      const unsubscribe = subscribeMockUser((next) => {
        if (next) {
          setUser(mockUserToSupabaseUser(next));
          setSession(mockUserToSession(next));
        } else {
          setUser(null);
          setSession(null);
        }
      });

      return () => {
        cancelled = true;
        unsubscribe();
      };
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Reads the shared auth state from context so screens do not duplicate session logic.
export const useAuth = () => {
  return useContext(AuthContext);
};
