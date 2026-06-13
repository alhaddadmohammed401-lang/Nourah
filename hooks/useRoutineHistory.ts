// useRoutineHistory — reads the last 7 days of routine completion from AsyncStorage and
// computes a current streak. AsyncStorage keys follow the pattern set in routine.tsx:
//   routine:YYYY-MM-DD:am  → JSON array of completed step IDs
//   routine:YYYY-MM-DD:pm  → JSON array of completed step IDs
// "Day complete" here means at least one step was checked off. Strict variants (all
// steps done) can be added later if the streak feels too forgiving.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type DayCompletion = {
  date: Date;
  iso: string; // YYYY-MM-DD
  am: boolean;
  pm: boolean;
};

function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function readDay(date: Date): Promise<DayCompletion> {
  const iso = localDateKey(date);
  const [amRaw, pmRaw] = await Promise.all([
    AsyncStorage.getItem(`routine:${iso}:am`),
    AsyncStorage.getItem(`routine:${iso}:pm`),
  ]);
  const parse = (raw: string | null): boolean => {
    if (!raw) return false;
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.length > 0;
    } catch {
      return false;
    }
  };
  return { date, iso, am: parse(amRaw), pm: parse(pmRaw) };
}

type Result = {
  loading: boolean;
  days: DayCompletion[]; // newest first; index 0 = today, index 6 = today minus 6
  amStreak: number; // consecutive days from today backwards with AM done
  refresh: () => Promise<void>;
};

export function useRoutineHistory(refreshKey?: unknown): Result {
  const [days, setDays] = useState<DayCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    const requests: Promise<DayCompletion>[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      requests.push(readDay(d));
    }
    const result = await Promise.all(requests);
    setDays(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  // Streak counts consecutive AM-complete days starting from today, walking backwards.
  // Stops at the first day without AM completion.
  let amStreak = 0;
  for (const d of days) {
    if (d.am) amStreak++;
    else break;
  }

  return { loading, days, amStreak, refresh: load };
}
