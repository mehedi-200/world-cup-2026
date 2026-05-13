import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const PollResults = ({ poll, onVote }) => {
  if (!poll) return null;

  const options = poll.options || [];
  const totalVotes = options.reduce((sum, opt) => sum + (opt.vote_count || 0), 0);
  const maxVotes = Math.max(...options.map((opt) => opt.vote_count || 0), 0);
  const hasVoted = poll.user_vote != null;

  return (
    <Card>
      <Card.Header>
        <h3>{poll.title}</h3>
      </Card.Header>
      <Card.Body>
        <div className="space-y-3">
          {options.map((option) => {
            const count = option.vote_count || 0;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isWinner = count === maxVotes && count > 0;
            const isUserVote = poll.user_vote === option.id;

            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${isUserVote ? 'text-fifa-gold' : 'text-gray-200'}`}>
                    {option.option_text || option.text || option.label}
                    {isUserVote && ' (Your vote)'}
                  </span>
                  <span className="text-gray-400">
                    {percentage}% ({count} vote{count !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner ? 'bg-fifa-gold' : 'bg-primary-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {!hasVoted && onVote && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVote(option.id)}
                    className="mt-1"
                  >
                    Vote
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-gray-500 text-sm text-center mt-4">
          Total: {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </p>
      </Card.Body>
    </Card>
  );
};

export default PollResults;
