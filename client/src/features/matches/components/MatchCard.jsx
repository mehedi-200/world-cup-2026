import React from 'react';
import Card from '@/components/ui/Card';
import TeamBadge from '@/components/shared/TeamBadge';
import ScoreDisplay from '@/components/shared/ScoreDisplay';
import StatusBadge from '@/components/shared/StatusBadge';
import CountdownTimer from '@/components/shared/CountdownTimer';
import { formatDate, formatTime } from '@/utils/formatDate';

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

  const isLive = status === 'live' || status === 'half_time';
  const isCompleted = status === 'completed';
  const isScheduled = status === 'scheduled';

  // Border accent per status
  const borderAccent = isLive
    ? 'border-red-500/40 animate-glow-pulse'
    : isCompleted
      ? 'border-green-500/20'
      : 'border-white/10';

  return (
    <div
      onClick={() => onClick?.(match.id)}
      className={`
        relative cursor-pointer rounded-xl overflow-hidden border transition-all duration-300
        bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-md
        hover:from-white/[0.09] hover:to-white/[0.04] hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5
        ${borderAccent}
      `.trim()}
    >
      {/* Live top glow bar */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      )}
      {isCompleted && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      )}

      <div className="px-5 pt-4 pb-4">
        {/* Top row: status + stage badge */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={status} minute={minute} />
          {stage && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              {stage}
            </span>
          )}
        </div>

        {/* Main match row: Home - Score - Away */}
        <div className="flex items-center justify-between gap-2">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0">
            <TeamBadge team={homeTeam} size="lg" vertical />
            {homeTeam.code && (
              <span className="text-[10px] text-gray-500 font-medium tracking-wider mt-1">
                {homeTeam.code}
              </span>
            )}
          </div>

          {/* Score */}
          <div className="flex-shrink-0 mx-2">
            <ScoreDisplay home={home_score} away={away_score} status={status} />
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0">
            <TeamBadge team={awayTeam} size="lg" vertical />
            {awayTeam.code && (
              <span className="text-[10px] text-gray-500 font-medium tracking-wider mt-1">
                {awayTeam.code}
              </span>
            )}
          </div>
        </div>

        {/* Scheduled: date/time + countdown */}
        {isScheduled && match_date && (
          <div className="mt-4 space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">{formatDate(match_date)}</p>
              <p className="text-xs text-gray-500">{formatTime(match_date)}</p>
            </div>
            <CountdownTimer targetDate={match_date} />
          </div>
        )}

        {/* Venue */}
        {venue && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            {/* Map pin icon */}
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{venue}{city ? `, ${city}` : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
