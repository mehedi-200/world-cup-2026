import { useParams, Link } from 'react-router-dom';
import { Button, Loader, Card } from '@/components/ui';
import { PageLayout } from '@/components/layout';
import { MatchDetail } from '@/features/matches';
import { PredictionForm } from '@/features/predictions';
import { useLiveMatch } from '@/features/matches/hooks/useLiveMatch';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useState, useEffect } from 'react';
import predictionService from '@/features/predictions/services/predictionService';

export default function MatchDetailPage() {
  const { id } = useParams();
  const { match, events, loading } = useLiveMatch(id);
  const { isAuthenticated } = useAuth();
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (isAuthenticated && id) {
      predictionService.getByMatch(id)
        .then((res) => { const d = res.data.data; setPrediction(d?.prediction || d); })
        .catch(() => {});
    }
  }, [isAuthenticated, id]);

  if (loading) return <Loader size="lg" text="Loading match..." />;
  if (!match) return <PageLayout title="Match not found" />;

  const handlePredictionSubmit = async (data) => {
    if (prediction) {
      await predictionService.update(prediction.id, data);
    } else {
      await predictionService.create({ ...data, match_id: parseInt(id) });
    }
    const res = await predictionService.getByMatch(id);
    const d = res.data.data;
    setPrediction(d?.prediction || d);
  };

  return (
    <PageLayout
      title=""
      action={<Link to="/matches"><Button variant="ghost" size="sm">&larr; All Matches</Button></Link>}
    >
      <MatchDetail match={match} events={events} />

      {isAuthenticated && match.status === 'scheduled' && (
        <div className="mt-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Your Prediction</h3>
          <PredictionForm
            match={match}
            existingPrediction={prediction}
            onSubmit={handlePredictionSubmit}
          />
        </div>
      )}
    </PageLayout>
  );
}
