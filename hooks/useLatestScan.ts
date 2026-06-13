import { useCallback, useEffect, useRef, useState } from 'react';
import { getLatestScan, pollScanStatus, type ScanResult } from '../services/scanService';
import { useAuth } from './useAuth';

type LatestScanState = {
  scan: ScanResult | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

// Reads the user's latest scan from the scan service. When the latest scan is in the
// 'pending' state (async YouCam analysis still running) this hook polls scan-status
// every 4 seconds until the row flips to 'complete' or 'failed'. The polling stops
// once the scan resolves or the component unmounts.
const POLL_INTERVAL_MS = 4000;
const MAX_POLL_DURATION_MS = 3 * 60 * 1000; // 3 minutes — well past YouCam's worst case.

export function useLatestScan(): LatestScanState {
  const { user } = useAuth();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pollHandle = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartedAt = useRef<number>(0);

  const stopPolling = useCallback(() => {
    if (pollHandle.current) {
      clearInterval(pollHandle.current);
      pollHandle.current = null;
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLatestScan(user?.id ?? null);
      setScan(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setScan(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
    return () => stopPolling();
  }, [load, stopPolling]);

  // Whenever the cached scan flips to 'pending', start a poll loop. Whenever it flips
  // off 'pending', stop polling.
  useEffect(() => {
    if (!scan || scan.status !== 'pending') {
      stopPolling();
      return;
    }
    if (pollHandle.current) return; // already polling

    pollStartedAt.current = Date.now();
    pollHandle.current = setInterval(async () => {
      if (Date.now() - pollStartedAt.current > MAX_POLL_DURATION_MS) {
        stopPolling();
        return;
      }
      const updated = await pollScanStatus(scan.id);
      if (updated) {
        setScan(updated);
        if (updated.status !== 'pending') stopPolling();
      }
    }, POLL_INTERVAL_MS);

    return () => stopPolling();
  }, [scan, stopPolling]);

  return { scan, loading, error, refetch: load };
}
