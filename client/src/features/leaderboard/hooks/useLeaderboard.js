import { useState, useEffect, useCallback } from 'react';
import leaderboardService from '../services/leaderboardService';

export function useLeaderboard(params = {}) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await leaderboardService.getAll(params);
      const d = data.data;
      setLeaderboard(Array.isArray(d) ? d : d?.leaderboard || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, loading, error, pagination };
}
