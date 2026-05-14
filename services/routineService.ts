// Mock routine service. Returns step IDs and metadata; the actual step copy lives in the
// locale dictionary (constants/locales.ts) so the screen renders the active language
// directly. When Gemini Flash takes over, it returns localized fields per request and
// the screen layer adapts without restructuring.

export type RoutineTimeOfDay = 'am' | 'pm';

export type RoutineSkinBand = 'green' | 'amber' | 'red';

export type RoutineStep = {
  id: string;
  timeOfDay: RoutineTimeOfDay;
  stepNumber: number;
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

// Returns a local mock plan so routine UI can ship before Gemini and RevenueCat are connected.
export async function getRoutinePlan(): Promise<RoutineServiceResult> {
  try {
    return { data: MOCK_ROUTINE_PLAN, error: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Routine plan could not be prepared. Please try again.';

    return { data: null, error: message };
  }
}
