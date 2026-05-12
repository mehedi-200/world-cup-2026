import { useState, useEffect, useCallback } from 'react';
import quizService from '../services/quizService';

export function useQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await quizService.getAll();
      const d = data.data;
      setQuizzes(Array.isArray(d) ? d : d?.quizzes || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return { quizzes, loading, error, refetch: fetchQuizzes };
}
