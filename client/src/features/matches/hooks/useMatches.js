import { useState, useEffect, useCallback } from 'react';
import matchService from '../services/matchService';

export function useMatches(filters = {}) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await matchService.getAll(filters);
      const d = data.data;
      setMatches(Array.isArray(d) ? d : d?.matches || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, pagination, refetch: fetchMatches };
}
