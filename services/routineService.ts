// Routine service. In mock mode (no Supabase env vars, or no scan yet) returns a local
// 6-step starter routine. In live mode, calls the routine-generate edge function which
// caches Gemini output in public.routines.

import { supabase } from './supabase';

export type RoutineTimeOfDay = 'am' | 'pm';

export type RoutineSkinBand = 'green' | 'amber' | 'red';

export type RoutineStep = {
  id: string;
  timeOfDay: RoutineTimeOfDay;
  stepNumber: number;
  // Optional localized fields populated by Gemini in live mode. Mock keeps these
  // undefined and the screen falls back to the locale dictionary.
  title_en?: string;
  title_ar?: string;
  why_en?: string;
  why_ar?: string;
};

export type RoutinePlan = {
  isPremium: boolean;
  skinBand: RoutineSkinBand;
  bandGlyph: string;
  amSteps: RoutineStep[];
  pmSteps: RoutineStep[];
};

export type RoutineServiceResult = {
  data: RoutinePlan | null;
  error: string | null;
};

const MOCK_AM_STEPS: RoutineStep[] = [
  { id: 'am-cleanse', timeOfDay: 'am', stepNumber: 1 },
  { id: 'am-treat', timeOfDay: 'am', stepNumber: 2 },
  { id: 'am-protect', timeOfDay: 'am', stepNumber: 3 },
];

const MOCK_PM_STEPS: RoutineStep[] = [
  { id: 'pm-cleanse', timeOfDay: 'pm', stepNumber: 1 },
  { id: 'pm-treat', timeOfDay: 'pm', stepNumber: 2 },
  { id: 'pm-restore', timeOfDay: 'pm', stepNumber: 3 },
];

const MOCK_ROUTINE_PLAN: RoutinePlan = {
  isPremium: false,
  skinBand: 'green',
  bandGlyph: '✓',
  amSteps: MOCK_AM_STEPS,
  pmSteps: MOCK_PM_STEPS,
};

// Returns a routine plan. Tries Supabase first; falls back to the mock plan whenever
// the backend is unavailable so the screen never blocks.
export async function getRoutinePlan(): Promise<RoutineServiceResult> {
  if (!supabase) {
    return { data: MOCK_ROUTINE_PLAN, error: null };
  }
  try {
    const { data, error } = await supabase.functions.invoke('routine-generate', {
      body: {},
    });
    if (error) {
      console.warn('routine-generate invoke failed', error.message);
      return { data: MOCK_ROUTINE_PLAN, error: null };
    }
    if (!data?.ok) {
      // No scan yet, or backend error: fall back to mock so the UI stays usable.
      return { data: MOCK_ROUTINE_PLAN, error: null };
    }
    return { data: data.data as RoutinePlan, error: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Routine plan could not be prepared. Please try again.';
    return { data: MOCK_ROUTINE_PLAN, error: message };
  }
}
