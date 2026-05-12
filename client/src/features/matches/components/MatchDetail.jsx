import React from 'react';
import Card from '@/components/ui/Card';
import TeamBadge from '@/components/shared/TeamBadge';
import ScoreDisplay from '@/components/shared/ScoreDisplay';
import StatusBadge from '@/components/shared/StatusBadge';
import MatchEventTimeline from './MatchEventTimeline';

const MatchDetail = ({ match, events = [] }) => {
  if (!match) return null;

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
    <div className="space-y-6">
      <Card className="text-center">
        <div className="mb-2">
          <StatusBadge status={status} minute={minute} />
          {stage && (
            <span className="ml-3 text-gray-400 text-sm">{stage}</span>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 my-6">
          <div className="flex flex-col items-center gap-2">
            <TeamBadge team={homeTeam} size="lg" />
          </div>

          <ScoreDisplay
            home={home_score}
            away={away_score}
            status={status}
            className="text-5xl"
          />

          <div className="flex flex-col items-center gap-2">
            <TeamBadge team={awayTeam} size="lg" reverse />
          </div>
        </div>

        {venue && (
          <p className="text-gray-500 text-sm">
            {venue}{city ? `, ${city}` : ''}
          </p>
        )}

        {match_date && (
          <p className="text-gray-500 text-xs mt-1">
            {new Date(match_date).toLocaleString()}
          </p>
        )}
      </Card>

      {events.length > 0 && (
        <Card>
          <Card.Header>Match Events</Card.Header>
          <Card.Body>
            <MatchEventTimeline events={events} />
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MatchDetail;
