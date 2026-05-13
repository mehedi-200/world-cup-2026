import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { QuizList } from '@/features/quiz';
import { useQuiz } from '@/features/quiz/hooks/useQuiz';

export default function QuizPage() {
  const { quizzes, loading, error } = useQuiz();
  const navigate = useNavigate();

  return (
    <PageLayout title="Quizzes" subtitle="Test your World Cup knowledge">
      <div className="max-w-lg mx-auto">
        <QuizList
          quizzes={quizzes}
          loading={loading}
          error={error}
          onStartQuiz={(quiz) => navigate(`/quizzes/${quiz.id}`)}
        />
      </div>
    </PageLayout>
  );
}
