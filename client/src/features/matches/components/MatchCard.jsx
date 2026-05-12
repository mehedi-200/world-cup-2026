import React from 'react';
import Card from '@/components/ui/Card';
import TeamBadge from '@/components/shared/TeamBadge';
import ScoreDisplay from '@/components/shared/ScoreDisplay';
import StatusBadge from '@/components/shared/StatusBadge';
import CountdownTimer from '@/components/shared/CountdownTimer';

const MatchCard = ({ match, onClick }) => {
  const { home_score, away_score, status, stage, venue, city, match_date, minute } = match;

  const homeTeam = {
    name: match.home_team_name,
    code: match.home_team_code,
    flag: match.home_team_flag,
  };
  const awayTeam = {
    name: match.away_team_name,
    code: match.away_team_code,
    flag: match.away_team_flag,
  };

  return (
    <Card hoverable onClick={() => onClick?.(match.id)} className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <TeamBadge team={homeTeam} size="md" />
        <ScoreDisplay home={home_score} away={away_score} status={status} />
        <TeamBadge team={awayTeam} size="md" reverse />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <StatusBadge status={status} minute={minute} />
        {stage && (
          <span className="text-gray-400 text-xs">{stage}</span>
        )}
      </div>

      {venue && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {venue}{city ? `, ${city}` : ''}
        </div>
      )}

      {status === 'scheduled' && match_date && (
        <div className="mt-3">
          <CountdownTimer targetDate={match_date} />
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
