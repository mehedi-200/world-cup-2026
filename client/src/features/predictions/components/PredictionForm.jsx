import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import TeamBadge from '@/components/shared/TeamBadge';

const PredictionForm = ({ match, existingPrediction, onSubmit }) => {
  const navigate = useNavigate();
  const [homeScore, setHomeScore] = useState(
    existingPrediction?.predicted_home_score ?? ''
  );
  const [awayScore, setAwayScore] = useState(
    existingPrediction?.predicted_away_score ?? ''
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingPrediction) {
      setHomeScore(existingPrediction.predicted_home_score ?? '');
      setAwayScore(existingPrediction.predicted_away_score ?? '');
    }
  }, [existingPrediction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (homeScore === '' || awayScore === '') return;

    setLoading(true);
    setError('');
    setSaved(false);
    try {
      await onSubmit?.({
        match_id: match.id,
        predicted_home_score: Number(homeScore),
        predicted_away_score: Number(awayScore),
      });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prediction');
    } finally {
      setLoading(false);
    }
  };

  const homeTeam = { name: match?.home_team_name, code: match?.home_team_code, flag: match?.home_team_flag };
  const awayTeam = { name: match?.away_team_name, code: match?.away_team_code, flag: match?.away_team_flag };

  if (saved) {
    return (
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-fifa-gold/10 to-green-500/10 animate-pulse" />

          <div className="relative p-8 text-center">
            {/* Success checkmark animation */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 mb-4"
              style={{ animation: 'bounceIn 0.6s ease-out' }}>
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ animation: 'drawCheck 0.4s ease-out 0.3s both' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {existingPrediction ? 'Prediction Updated!' : 'Prediction Saved!'}
            </h3>

            {/* Show the prediction */}
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="text-center">
                <TeamBadge team={homeTeam} size="sm" />
              </div>
              <div className="bg-white/10 rounded-xl px-5 py-3 border border-fifa-gold/30">
                <span className="text-3xl font-extrabold text-fifa-gold">
                  {homeScore} - {awayScore}
                </span>
              </div>
              <div className="text-center">
                <TeamBadge team={awayTeam} size="sm" reverse />
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              You'll earn points when the match is completed based on your prediction accuracy.
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="gold" size="md" onClick={() => navigate('/predictions')}>
                View My Predictions
              </Button>
              <Button variant="secondary" size="md" onClick={() => setSaved(false)}>
                Edit Prediction
              </Button>
            </div>

            {/* Points info */}
            <div className="mt-6 grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-fifa-gold font-bold text-sm">+10</p>
                <p className="text-gray-500 text-[10px]">Exact Score</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-blue-400 font-bold text-sm">+5</p>
                <p className="text-gray-500 text-[10px]">Goal Diff</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-green-400 font-bold text-sm">+3</p>
                <p className="text-gray-500 text-[10px]">Winner</p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes drawCheck {
            0% { stroke-dasharray: 30; stroke-dashoffset: 30; opacity: 0; }
            100% { stroke-dasharray: 30; stroke-dashoffset: 0; opacity: 1; }
          }
        `}</style>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h3 className="text-center font-semibold text-gray-100">
          {existingPrediction ? 'Update Your Prediction' : 'Make Your Prediction'}
        </h3>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {existingPrediction && (
            <div className="text-center">
              <Badge variant="info" size="sm">
                Current: {existingPrediction.predicted_home_score} - {existingPrediction.predicted_away_score}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <TeamBadge team={homeTeam} size="md" />
              <Input
                type="number"
                min="0"
                max="99"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="mt-2 text-center text-2xl font-bold"
                placeholder="0"
                required
              />
            </div>

            <span className="text-gray-500 text-2xl font-bold mt-6">-</span>

            <div className="flex-1 text-center">
              <TeamBadge team={awayTeam} size="md" reverse />
              <Input
                type="number"
                min="0"
                max="99"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="mt-2 text-center text-2xl font-bold"
                placeholder="0"
                required
              />
            </div>
          </div>

          <Button type="submit" fullWidth isLoading={loading} variant="gold" size="lg">
            {existingPrediction ? 'Update Prediction' : 'Submit Prediction'}
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
};

export default PredictionForm;
