import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const PollCard = ({ poll, onVote, onViewResults }) => {
  const { title, total_votes, expires_at, has_voted } = poll;

  const isExpired = expires_at ? new Date(expires_at) < new Date() : false;

  return (
    <Card hoverable className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-100 line-clamp-2">{title}</h3>
          {isExpired && <Badge variant="neutral" size="sm">Closed</Badge>}
        </div>

        <p className="text-gray-500 text-sm">
          {total_votes || 0} vote{total_votes !== 1 ? 's' : ''}
        </p>

        {expires_at && !isExpired && (
          <p className="text-gray-500 text-xs mt-1">
            Ends {new Date(expires_at).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {!has_voted && !isExpired ? (
          <Button variant="primary" size="sm" fullWidth onClick={() => onVote?.(poll)}>
            Vote Now
          </Button>
        ) : (
          <Button variant="secondary" size="sm" fullWidth onClick={() => onViewResults?.(poll)}>
            View Results
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PollCard;
