import React from 'react';
import Loader from '@/components/ui/Loader';
import MatchCard from './MatchCard';

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    <p className="text-gray-400 text-lg">{message}</p>
  </div>
);

const MatchList = ({ matches = [], loading, error, onMatchClick }) => {
  if (loading) {
    return <Loader size="lg" text="Loading matches..." />;
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  if (matches.length === 0) {
    return <EmptyState message="No matches found" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onClick={onMatchClick} />
      ))}
    </div>
  );
};

export default MatchList;
