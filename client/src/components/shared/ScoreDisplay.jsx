import React from 'react';

const ScoreDisplay = ({ home, away, status, className = '' }) => {
  // Scheduled: show a styled "VS"
  if (status === 'scheduled') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
        <span className="text-base font-bold text-gray-500 tracking-widest uppercase">VS</span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
      </div>
    );
  }

  const isLive = status === 'live' || status === 'half_time';
  const isCompleted = status === 'completed';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`
          flex items-center gap-2 px-4 py-1.5 rounded-full font-extrabold text-2xl tracking-wide
          ${isLive ? 'bg-green-500/15 text-green-400 animate-score-pulse shadow-lg shadow-green-500/10' : ''}
          ${isCompleted ? 'bg-white/10 text-white' : ''}
          ${!isLive && !isCompleted ? 'bg-white/5 text-gray-200' : ''}
        `.trim()}
      >
        <span>{home ?? '-'}</span>
        <span className={`text-lg ${isLive ? 'text-green-600' : 'text-gray-600'}`}>:</span>
        <span>{away ?? '-'}</span>
      </div>
      {isCompleted && (
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Full Time
        </span>
      )}
    </div>
  );
};

export default ScoreDisplay;
