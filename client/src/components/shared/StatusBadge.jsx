import React from 'react';
import Badge from '@/components/ui/Badge';

const StatusBadge = ({ status, minute }) => {
  switch (status) {
    case 'scheduled':
      return <Badge variant="info">Upcoming</Badge>;

    case 'live':
      return (
        <Badge variant="danger">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-live mr-1 inline-block" />
          LIVE {minute != null ? `${minute}'` : ''}
        </Badge>
      );

    case 'half_time':
      return <Badge variant="warning">HT</Badge>;

    case 'completed':
      return <Badge variant="success">FT</Badge>;

    case 'postponed':
      return <Badge variant="neutral">PPD</Badge>;

    default:
      return <Badge variant="neutral">{status || 'Unknown'}</Badge>;
  }
};

export default StatusBadge;
