import React from 'react';
import Card from '@/components/ui/Card';

const UserRankCard = ({ rank, user }) => {
  return (
    <Card className="text-center bg-gradient-to-br from-primary-600/20 to-primary-900/20 border-primary-500/30">
      <p className="text-gray-400 text-sm uppercase tracking-wide">Your Position</p>
      <div className="my-3">
        <span className="text-5xl font-bold text-fifa-gold">
          #{rank || '--'}
        </span>
      </div>
      <p className="text-gray-200 font-medium text-lg">
        {user?.username || 'Unknown'}
      </p>
      <p className="text-gray-400 text-sm mt-1">
        <span className="text-fifa-gold font-bold">{user?.total_points || 0}</span> points
      </p>
      {user?.predictions_count != null && (
        <p className="text-gray-500 text-xs mt-1">
          {user.predictions_count} predictions made
        </p>
      )}
    </Card>
  );
};

export default UserRankCard;
