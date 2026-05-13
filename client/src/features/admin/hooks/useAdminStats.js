import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

export function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, activityRes] = await Promise.all([
        adminService.getStats(),
        adminService.getActivity(15),
      ]);
      setStats(statsRes.data.data);
      setActivity(activityRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, activity, loading, error, refetch: fetch };
}
