// Wraps face-scan analysis behind a single interface so the Home and Scan screens never
// touch a third-party SDK directly.
//
// Modes (set via EXPO_PUBLIC_SCAN_MODE):
//   - 'mock'       : returns MOCK_SCAN_RESULT (a healthy returning-user scan).
//   - 'mock-empty' : returns null from getLatestScan to simulate first-run state.
//   - 'mock-stale' : returns MOCK_SCAN_RESULT with a created_at 12 days in the past.
//   - 'live'       : reads from Supabase public.scans / invokes the scan-analyze
//                    edge function (async: kick off + poll via scan-status).

import { supabase } from './supabase';

export type ScoreBand = 'green' | 'amber' | 'red';
export type GccFlag = 'melasma_risk' | 'high_uv' | 'humidity_warning';
export type ScanStatus = 'pending' | 'complete' | 'failed';

export type ScanResult = {
  id: string;
  status: ScanStatus;
  hydration_score: number | null;
  pores_score: 'small' | 'medium' | 'large' | null;
  pigmentation_score: number | null;
  acne_count: number | null;
  overall_score: number | null;
  band: ScoreBand | null;
  gcc_flags: GccFlag[];
  routine_type: 'oily' | 'dry' | 'combination' | null;
  task_id?: string | null;
  error?: string | null;
  created_at: string;
};

const MODE = (process.env.EXPO_PUBLIC_SCAN_MODE ?? 'mock') as
  | 'mock'
  | 'mock-empty'
  | 'mock-stale'
  | 'live';

const MOCK_SCAN_RESULT: ScanResult = {
  id: 'mock-scan-001',
  status: 'complete',
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

// Returns up to `limit` past scans for the user, newest first. Used by the Scan History
// screen reached from Profile. Mock modes return a small canned history so the screen
// is exercisable offline. Live mode reads directly from public.scans (RLS scopes to user).
export async function listScans(
  userId?: string | null,
  limit = 20,
): Promise<ScanResult[]> {
  if (MODE === 'mock-empty') {
    await delay(200);
    return [];
  }
  if (MODE === 'mock' || MODE === 'mock-stale') {
    await delay(200);
    // Three rows: today (score 78), 8 days ago (score 64), 17 days ago (score 52).
    const base = MOCK_SCAN_RESULT;
    return [
      base,
      { ...base, id: 'mock-history-1', overall_score: 64, band: 'amber', created_at: daysAgoIso(8) },
      { ...base, id: 'mock-history-2', overall_score: 52, band: 'amber', created_at: daysAgoIso(17) },
    ];
  }
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.warn('listScans failed', error.message);
    return [];
  }
  return (data as ScanResult[]) ?? [];
}

// Returns the user's most recent scan, or null if none exists.
export async function getLatestScan(userId?: string | null): Promise<ScanResult | null> {
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
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.warn('getLatestScan failed', error.message);
    return null;
  }
  return (data as ScanResult) ?? null;
}

// Kicks off a real scan. Returns a 'pending' scan row immediately; the caller is
// expected to navigate back to Home and let useLatestScan auto-poll until status flips.
export async function analyzeSkin(imageBase64: string): Promise<ScanResult> {
  if (MODE !== 'live') {
    await delay(1500);
    return MOCK_SCAN_RESULT;
  }
  if (!supabase) {
    throw new Error('Supabase client not initialized; cannot run live scan.');
  }
  const { data, error } = await supabase.functions.invoke('scan-analyze', {
    body: { image_base64: imageBase64 },
  });
  if (error) throw new Error(error.message);
  if (!data?.ok) {
    throw new Error(data?.message ?? 'Scan analysis failed');
  }
  return data.data as ScanResult;
}

// Polls scan-status once. Returns the (possibly updated) row. If scan is still pending,
// status remains 'pending' and the caller should poll again after a delay.
export async function pollScanStatus(scanId: string): Promise<ScanResult | null> {
  if (MODE !== 'live' || !supabase) return null;
  const { data, error } = await supabase.functions.invoke('scan-status', {
    body: { scan_id: scanId },
  });
  if (error) {
    console.warn('pollScanStatus invoke failed', error.message);
    return null;
  }
  if (!data?.ok) {
    console.warn('pollScanStatus returned !ok', data?.code, data?.message);
    return null;
  }
  return data.data as ScanResult;
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
