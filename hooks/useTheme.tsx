// Theme is selected by the user in Profile → Appearance and persisted to AsyncStorage.
// Three user-facing modes:
//   - 'light' / 'dark' — explicit manual choice
//   - 'system'        — follow the OS / browser preference live
//
// The hook resolves the user's choice down to a concrete `'light' | 'dark'` theme name
// plus the matching `ThemeColors` token set (from constants/colors.ts). Components
// consume `useTheme().colors.surface` etc.; the legacy flat `colors` export keeps
// pointing at Light so unmigrated code still renders correctly during the sweep.

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
import { Platform, useColorScheme } from 'react-native';
import { colorScheme as nativeWindColorScheme } from 'nativewind';
import {
  darkTheme,
  lightTheme,
  type ThemeColors,
  type ThemeName,
} from '../constants/colors';

const STORAGE_KEY = 'nourah:theme-mode';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  // Resolved theme — always 'light' or 'dark', never 'system'. This is what components
  // should branch on for one-off platform tweaks.
  theme: ThemeName;
  // The active token set (lightTheme or darkTheme).
  colors: ThemeColors;
  // The user's stored preference. Use this to render the Appearance toggle's selected
  // state — it's what the user explicitly picked, including 'system'.
  mode: ThemeMode;
  // Has the AsyncStorage read completed? Gate the first render on this if you want to
  // avoid a single-frame flash of the wrong theme on launch. Most surfaces are fine
  // ignoring it because Soft Blush → Warm Dark is a small enough delta.
  ready: boolean;
  setMode: (next: ThemeMode) => Promise<void>;
};

function resolveTheme(mode: ThemeMode, system: 'light' | 'dark' | null): ThemeName {
  if (mode === 'system') return system === 'dark' ? 'dark' : 'light';
  return mode;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  colors: lightTheme,
  mode: 'system',
  ready: false,
  setMode: async () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // `useColorScheme()` returns 'light' | 'dark' | null. On web it tracks
  // prefers-color-scheme live; on native it tracks the OS appearance setting. `null`
  // means we can't detect — we treat that as 'light' for safety.
  const systemScheme = useColorScheme() ?? 'light';

  const [mode, setModeState] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        // Validate the stored value before trusting it. AsyncStorage can hold anything
        // a buggy previous version wrote.
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback(async (next: ThemeMode) => {
    setModeState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Failing to persist is non-fatal — the choice still applies for the session.
    }
  }, []);

  const theme = useMemo<ThemeName>(
    () => resolveTheme(mode, systemScheme),
    [mode, systemScheme],
  );
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  // Side effect: keep platform-level theme state in sync with our resolved theme.
  //   - On web, toggle the `dark` class on documentElement. The CSS variables in
  //     global.css are scoped to `:root` (light) and `.dark` (dark), so every
  //     Tailwind utility class (bg-softBlush, text-deepMauve, ...) automatically
  //     repaints when the class flips.
  //   - On native, drive NativeWind's `colorScheme` controller. NativeWind v4
  //     reads the same CSS-variable declarations at build time and switches
  //     compiled classes based on this setter.
  // Both calls are idempotent — safe to fire on every resolved-theme change.
  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
      }
    } else {
      nativeWindColorScheme.set(theme);
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, colors, mode, ready, setMode }),
    [theme, colors, mode, ready, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
