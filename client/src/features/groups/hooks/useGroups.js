import { useState, useEffect, useCallback } from 'react';
import groupService from '../services/groupService';

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await groupService.getAll();
      const d = data.data;
      setGroups(Array.isArray(d) ? d : d?.groups || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, refetch: fetchGroups };
}
