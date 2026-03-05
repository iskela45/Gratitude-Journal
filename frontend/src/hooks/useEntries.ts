import { useState, useEffect } from 'react';
import { getEntries, type EntryFilters } from '../api/client';
import type { Entry } from '../types';

interface UseEntriesResult {
  entries: Entry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEntries(filters?: EntryFilters): UseEntriesResult {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getEntries(filters)
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters?.year, filters?.month, tick]);

  return {
    entries,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
