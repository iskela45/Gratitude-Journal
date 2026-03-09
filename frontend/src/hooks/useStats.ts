import { useState, useEffect } from 'react';
import { getStats } from '../api/client';
import type { Stats } from '../types';

interface UseStatsResult {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getStats()
      .then((data) => { if (!cancelled) setStats(data); })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (!cancelled) setError(message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
