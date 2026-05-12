import React from 'react';

const LiveIndicator = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-live" />
      <span className="text-red-400 text-xs font-bold uppercase">Live</span>
    </div>
  );
};

export default LiveIndicator;
