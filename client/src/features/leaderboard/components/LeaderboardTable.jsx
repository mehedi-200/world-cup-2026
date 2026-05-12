import React from 'react';
import Table from '@/components/ui/Table';
import Avatar from '@/components/ui/Avatar';
import Loader from '@/components/ui/Loader';

const getRankStyle = (rank) => {
  switch (rank) {
    case 1: return 'text-fifa-gold font-bold';
    case 2: return 'text-gray-300 font-bold';
    case 3: return 'text-amber-600 font-bold';
    default: return 'text-gray-400';
  }
};

const getRankIcon = (rank) => {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return rank;
  }
};

const columns = [
  {
    key: 'rank',
    label: '#',
    render: (value) => (
      <span className={`text-lg ${getRankStyle(value)}`}>
        {getRankIcon(value)}
      </span>
    ),
  },
  {
    key: 'username',
    label: 'User',
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <Avatar
          src={row.avatar_url}
          alt={value}
          size="sm"
          fallback={value || '?'}
        />
        <span className="text-gray-200 font-medium">{value || 'Unknown'}</span>
      </div>
    ),
  },
  {
    key: 'total_points',
    label: 'Points',
    render: (value, row) => (
      <span className={`font-bold ${getRankStyle(row.rank)}`}>
        {value || 0}
      </span>
    ),
  },
];

const LeaderboardTable = ({ leaderboard = [], loading, error }) => {
  if (loading) return <Loader size="lg" text="Loading leaderboard..." />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return <Table columns={columns} data={leaderboard} />;
};

export default LeaderboardTable;
