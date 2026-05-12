import React from 'react';
import Avatar from '@/components/ui/Avatar';

const getRankStyle = (rank) => {
  switch (rank) {
    case 1:
      return 'text-fifa-gold font-bold';
    case 2:
      return 'text-gray-300 font-bold';
    case 3:
      return 'text-amber-600 font-bold';
    default:
      return 'text-gray-400';
  }
};

const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return rank;
  }
};

const LeaderboardRow = ({ rank, user, points, predictions_count }) => {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition">
      <td className="px-4 py-3">
        <span className={`text-lg ${getRankStyle(rank)}`}>
          {getRankIcon(rank)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            size="sm"
            fallback={user?.username || '?'}
          />
          <span className="text-gray-200 font-medium">
            {user?.username || 'Unknown'}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`font-bold ${getRankStyle(rank)}`}>{points || 0}</span>
      </td>
      <td className="px-4 py-3 text-gray-400">
        {predictions_count || 0}
      </td>
    </tr>
  );
};

export default LeaderboardRow;
