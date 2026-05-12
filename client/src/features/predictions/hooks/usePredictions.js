import { useState, useEffect, useCallback } from 'react';
import predictionService from '../services/predictionService';

export function usePredictions(params = {}) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await predictionService.getAll(params);
      const d = data.data;
      setPredictions(Array.isArray(d) ? d : d?.predictions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return { predictions, loading, error, refetch: fetchPredictions };
}
