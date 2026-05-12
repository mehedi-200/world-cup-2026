import React from 'react';
import Table from '@/components/ui/Table';
import TeamBadge from '@/components/shared/TeamBadge';

const columns = [
  {
    key: 'team',
    label: 'Team',
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <TeamBadge team={row.team || row} size="sm" />
      </div>
    ),
  },
  { key: 'played', label: 'P' },
  { key: 'won', label: 'W' },
  { key: 'drawn', label: 'D' },
  { key: 'lost', label: 'L' },
  { key: 'goals_for', label: 'GF' },
  { key: 'goals_against', label: 'GA' },
  {
    key: 'goal_difference',
    label: 'GD',
    render: (value) => {
      const gd = value || 0;
      const color = gd > 0 ? 'text-green-400' : gd < 0 ? 'text-red-400' : 'text-gray-400';
      return <span className={color}>{gd > 0 ? `+${gd}` : gd}</span>;
    },
  },
  {
    key: 'points',
    label: 'Pts',
    render: (value) => (
      <span className="font-bold text-gray-100">{value || 0}</span>
    ),
  },
];

const GroupTable = ({ group }) => {
  if (!group) return null;

  const teams = (group.teams || []).map((team, index) => ({
    ...team,
    _qualified: index < 2,
  }));

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-gray-400 text-xs uppercase font-medium"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`
                  border-b border-white/5 hover:bg-white/5 transition
                  ${row._qualified ? 'border-l-2 border-l-green-500' : ''}
                `.trim()}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2.5 text-gray-200 text-sm">
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupTable;
