// Language is selected by the user in the Profile/Settings tab and persisted to
// AsyncStorage. The provider gates UI on a hydration step so we never flash the wrong
// language on launch. RTL layout flip via I18nManager.forceRTL requires a native reload
// to take effect; the Profile screen surfaces a one-line restart hint when Arabic is
// selected, since wiring expo-updates auto-reload is deferred.

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { I18nManager } from 'react-native';
import { resolve, type Lang } from '../constants/locales';

const STORAGE_KEY = 'nourah:lang';
const DEFAULT_LANG: Lang = 'en';

type LanguageContextValue = {
  lang: Lang;
  ready: boolean;
  setLang: (next: Lang) => Promise<void>;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  ready: false,
  setLang: async () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (cancelled) return;

        const next: Lang = stored === 'ar' ? 'ar' : 'en';
        setLangState(next);

        // forceRTL only changes layout direction after a fresh JS load on native.
        // Calling it on hydration keeps web in sync immediately and primes native
        // for the next launch.
        I18nManager.allowRTL(true);
        if (I18nManager.isRTL !== (next === 'ar')) {
          I18nManager.forceRTL(next === 'ar');
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setLang = useCallback(async (next: Lang) => {
    setLangState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Failing to persist is non-fatal; the in-memory choice still applies for this
      // session.
    }
    if (I18nManager.isRTL !== (next === 'ar')) {
      I18nManager.forceRTL(next === 'ar');
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      ready,
      setLang,
      t: (key, vars) => resolve(lang, key, vars),
    }),
    [lang, ready, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
