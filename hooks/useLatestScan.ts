import { useCallback, useEffect, useState } from 'react';
import { getLatestScan, type ScanResult } from '../services/scanService';
import { useAuth } from './useAuth';

type LatestScanState = {
  scan: ScanResult | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

// Reads the user's latest scan from the scan service. The service handles mock-vs-live mode,
// so this hook stays thin and only carries loading/error state for the UI.
export function useLatestScan(): LatestScanState {
  const { user } = useAuth();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
  }, [load]);

  return { scan, loading, error, refetch: load };
}
