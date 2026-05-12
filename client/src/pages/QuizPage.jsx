import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { QuizList } from '@/features/quiz';
import { useQuiz } from '@/features/quiz/hooks/useQuiz';

export default function QuizPage() {
  const { quizzes, loading, error } = useQuiz();
  const navigate = useNavigate();

  return (
    <PageLayout title="Quizzes" subtitle="Test your World Cup knowledge">
      <QuizList
        quizzes={quizzes}
        loading={loading}
        error={error}
        onQuizClick={(id) => navigate(`/quizzes/${id}`)}
      />
    </PageLayout>
  );
}
