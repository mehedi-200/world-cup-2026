import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Button } from '@/components/ui';
import { PageLayout } from '@/components/layout';
import { QuizPlayer, QuizResult } from '@/features/quiz';
import { ProtectedRoute } from '@/features/auth';
import quizService from '@/features/quiz/services/quizService';

function QuizPlayContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    quizService.getById(id)
      .then((res) => setQuiz(res.data.data))
      .catch(() => navigate('/quizzes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleComplete = async (answers) => {
    const res = await quizService.submitAttempt(id, { answers });
    setResult(res.data.data);
  };

  if (loading) return <Loader size="lg" text="Loading quiz..." />;

  if (result) {
    return (
      <PageLayout title={quiz.title}>
        <QuizResult
          score={result.score}
          totalQuestions={result.total_questions}
          totalPoints={result.score}
        />
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="secondary" onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={quiz.title}>
      <QuizPlayer quiz={quiz} onComplete={handleComplete} />
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
