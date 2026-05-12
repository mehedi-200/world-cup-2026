import React from 'react';
import Loader from '@/components/ui/Loader';
import Card from '@/components/ui/Card';
import PredictionCard from './PredictionCard';

const PredictionHistory = ({ predictions = [], loading }) => {
  if (loading) {
    return <Loader size="md" text="Loading predictions..." />;
  }

  const totalPoints = predictions.reduce(
    (sum, p) => sum + (p.points_earned || 0),
    0
  );

  const totalWithResults = predictions.filter(
    (p) => p.points_earned != null
  ).length;

  const correctPredictions = predictions.filter(
    (p) => p.points_earned && p.points_earned > 0
  ).length;

  const accuracy =
    totalWithResults > 0
      ? Math.round((correctPredictions / totalWithResults) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-gray-500 text-xs uppercase">Total Points</p>
          <p className="text-2xl font-bold text-fifa-gold">{totalPoints}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-500 text-xs uppercase">Predictions</p>
          <p className="text-2xl font-bold text-gray-100">{predictions.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-gray-500 text-xs uppercase">Accuracy</p>
          <p className="text-2xl font-bold text-green-400">{accuracy}%</p>
        </Card>
      </div>

      {predictions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No predictions yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Start predicting match scores to earn points!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
