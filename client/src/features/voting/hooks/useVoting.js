import { useState, useEffect, useCallback } from 'react';
import votingService from '../services/votingService';

export function useVoting() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await votingService.getAll();
      setPolls(data.data?.polls || data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  return { polls, loading, error, refetch: fetchPolls };
}
