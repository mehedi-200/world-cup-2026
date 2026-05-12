import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TeamBadge from '@/components/shared/TeamBadge';
import ScoreDisplay from '@/components/shared/ScoreDisplay';

const PointsBadge = ({ points }) => {
  if (points == null) return null;

  const variant = points > 0 ? 'success' : 'neutral';
  return (
    <Badge variant={variant} size="sm">
      {points > 0 ? `+${points}` : points} pts
    </Badge>
  );
};

const PredictionCard = ({ prediction }) => {
  const { predicted_home_score, predicted_away_score, points_earned } = prediction;

  const homeTeam = { name: prediction.home_team_name, code: prediction.home_team_code, flag: prediction.home_team_flag };
  const awayTeam = { name: prediction.away_team_name, code: prediction.away_team_code, flag: prediction.away_team_flag };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <TeamBadge team={homeTeam} size="sm" />
        <ScoreDisplay
          home={prediction.home_score}
          away={prediction.away_score}
          status={prediction.status}
        />
        <TeamBadge team={awayTeam} size="sm" reverse />
      </div>

      <div className="border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs uppercase">Your Prediction</p>
            <p className="text-lg font-bold text-gray-200">
              {predicted_home_score} - {predicted_away_score}
            </p>
          </div>
          <PointsBadge points={points_earned} />
        </div>
      </div>
    </Card>
  );
};

export default PredictionCard;
