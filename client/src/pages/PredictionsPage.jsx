import { PageLayout } from '@/components/layout';
import { PredictionHistory } from '@/features/predictions';
import { usePredictions } from '@/features/predictions/hooks/usePredictions';
import { ProtectedRoute } from '@/features/auth';

function PredictionsContent() {
  const { predictions, loading, error } = usePredictions();

  return (
    <PageLayout title="My Predictions" subtitle="Track your match predictions and points">
      <PredictionHistory predictions={predictions} loading={loading} />
    </PageLayout>
  );
}

export default function PredictionsPage() {
  return (
    <ProtectedRoute>
      <PredictionsContent />
    </ProtectedRoute>
  );
}
