import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '@/components/ui';
import { PageLayout } from '@/components/layout';
import { QuizPlayer, QuizResult } from '@/features/quiz';
import { ProtectedRoute } from '@/features/auth';
import quizService from '@/features/quiz/services/quizService';
import { useToast } from '@/hooks/useToast';

function QuizPlayContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    quizService.getById(id)
      .then((res) => {
        const d = res.data.data;
        setQuiz(d?.quiz || d);
      })
      .catch(() => {
        showToast('Quiz not found', 'error');
        navigate('/quizzes');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, showToast]);

  const handleComplete = async (answers) => {
    setSubmitting(true);
    try {
      const res = await quizService.submitAttempt(id, { answers });
      const d = res.data.data;
      setResult(d?.attempt || d);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" text="Loading quiz..." /></div>;

  if (result) {
    return (
      <PageLayout title={quiz?.title || 'Quiz Result'}>
        <QuizResult
          score={result.score}
          totalQuestions={result.total_questions}
          totalPoints={result.points_earned}
          onGoBack={() => navigate('/quizzes')}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={quiz?.title || 'Quiz'} subtitle={quiz?.description}>
      {submitting ? (
        <div className="flex justify-center py-20"><Loader size="lg" text="Submitting..." /></div>
      ) : (
        <QuizPlayer quiz={quiz} onComplete={handleComplete} />
      )}
    </PageLayout>
  );
}

export default function QuizPlayPage() {
  return (
    <ProtectedRoute>
      <QuizPlayContent />
    </ProtectedRoute>
  );
}
