import React from 'react';

const ScoreDisplay = ({ home, away, status, className = '' }) => {
  if (status === 'scheduled') {
    return (
      <span className={`text-gray-400 text-lg font-bold ${className}`}>
        VS
      </span>
    );
  }

  const isLive = status === 'live' || status === 'half_time';
  const liveClasses = status === 'live' ? 'animate-pulse-live text-green-400' : 'text-white';

  return (
    <span className={`text-2xl font-bold ${isLive ? liveClasses : 'text-white'} ${className}`}>
      {home ?? '-'} - {away ?? '-'}
    </span>
  );
};

export default ScoreDisplay;
