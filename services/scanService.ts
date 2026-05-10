// Wraps face-scan analysis behind a single interface so the Home and Scan screens never
// touch a third-party SDK directly. Defaults to mock mode in development so the
// Perfect Corp 1,000-scan/month free tier is never spent during build or self-testing.
//
// Modes (set via EXPO_PUBLIC_SCAN_MODE):
//   - 'mock'       : returns MOCK_SCAN_RESULT (a healthy returning-user scan).
//   - 'mock-empty' : returns null from getLatestScan to simulate first-run state.
//   - 'mock-stale' : returns MOCK_SCAN_RESULT with a created_at 12 days in the past.
//   - 'live'       : calls the real Perfect Corp SDK (not implemented yet).

export type ScoreBand = 'green' | 'amber' | 'red';

export type GccFlag = 'melasma_risk' | 'high_uv' | 'humidity_warning';

export type ScanResult = {
  id: string;
  hydration_score: number;
  pores_score: 'small' | 'medium' | 'large';
  pigmentation_score: number;
  acne_count: number;
  overall_score: number;
  band: ScoreBand;
  gcc_flags: GccFlag[];
  routine_type: 'oily' | 'dry' | 'combination';
  created_at: string;
};

const MODE = (process.env.EXPO_PUBLIC_SCAN_MODE ?? 'mock') as
  | 'mock'
  | 'mock-empty'
  | 'mock-stale'
  | 'live';

const MOCK_SCAN_RESULT: ScanResult = {
  id: 'mock-scan-001',
  hydration_score: 78,
  pores_score: 'small',
  pigmentation_score: 32,
  acne_count: 1,
  overall_score: 78,
  band: 'green',
  gcc_flags: ['high_uv', 'humidity_warning'],
  routine_type: 'combination',
  created_at: new Date().toISOString(),
};

const MOCK_STALE_RESULT: ScanResult = {
  ...MOCK_SCAN_RESULT,
  id: 'mock-scan-stale',
  created_at: daysAgoIso(12),
};

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Returns the user's most recent scan, or null if none exists.
// In mock mode this is synchronous-ish; the small delay simulates real network behavior
// so Home's loading state can be observed during development.
export async function getLatestScan(_userId?: string | null): Promise<ScanResult | null> {
  if (MODE === 'mock-empty') {
    await delay(300);
    return null;
  }
  if (MODE === 'mock-stale') {
    await delay(300);
    return MOCK_STALE_RESULT;
  }
  if (MODE === 'mock') {
    await delay(300);
    return MOCK_SCAN_RESULT;
  }
  // Live mode placeholder. Real Supabase + Perfect Corp wiring lands in a later craft run.
  await delay(300);
  return null;
}

// Analyzes a base64-encoded face image. Mocked during development to protect the API quota.
export async function analyzeSkin(_imageBase64: string): Promise<ScanResult> {
  if (MODE === 'live') {
    throw new Error('Live scan mode is not implemented yet. Set EXPO_PUBLIC_SCAN_MODE=mock.');
  }
  await delay(1500);
  return MOCK_SCAN_RESULT;
}

export function bandFromScore(score: number): ScoreBand {
  if (score >= 70) return 'green';
  if (score >= 40) return 'amber';
  return 'red';
}

export function isStaleScan(scan: ScanResult, thresholdDays = 7): boolean {
  const created = new Date(scan.created_at).getTime();
  const ageDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return ageDays > thresholdDays;
}

export function daysSinceScan(scan: ScanResult): number {
  const created = new Date(scan.created_at).getTime();
  return Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
}

export const __scanMode = MODE;
