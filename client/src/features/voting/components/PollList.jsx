import React from 'react';
import Loader from '@/components/ui/Loader';
import PollCard from './PollCard';

const PollList = ({ polls = [], loading, error, onVote, onViewResults, onPollClick }) => {
  if (loading) {
    return <Loader size="lg" text="Loading polls..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No polls available</p>
        <p className="text-gray-500 text-sm mt-1">Check back later for new polls!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          onVote={onPollClick ? () => onPollClick(poll.id) : onVote}
          onViewResults={onPollClick ? () => onPollClick(poll.id) : onViewResults}
        />
      ))}
    </div>
  );
};

export default PollList;
