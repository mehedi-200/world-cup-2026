import React from 'react';

const StatusBadge = ({ status, minute }) => {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide';

  switch (status) {
    case 'live':
      return (
        <span className={`${base} bg-red-500/20 text-red-400 border border-red-500/30`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          LIVE{minute != null ? ` ${minute}'` : ''}
        </span>
      );

    case 'scheduled':
      return (
        <span className={`${base} bg-blue-500/15 text-blue-400 border border-blue-500/20`}>
          {/* Clock icon */}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Upcoming
        </span>
      );

    case 'half_time':
      return (
        <span className={`${base} bg-amber-500/20 text-amber-400 border border-amber-500/30`}>
          {/* Pause icon */}
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
          Half Time
        </span>
      );

    case 'completed':
      return (
        <span className={`${base} bg-green-500/15 text-green-400 border border-green-500/20`}>
          {/* Check icon */}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Full Time
        </span>
      );

    case 'postponed':
      return (
        <span className={`${base} bg-gray-500/20 text-gray-400 border border-gray-500/20`}>
          {/* X circle icon */}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Postponed
        </span>
      );

    default:
      return (
        <span className={`${base} bg-gray-500/20 text-gray-400 border border-gray-500/20`}>
          {status || 'Unknown'}
        </span>
      );
  }
};

export default StatusBadge;
