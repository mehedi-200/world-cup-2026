import React from 'react';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import GroupTable from './GroupTable';

const GroupStageView = ({ groups = [], loading, error }) => {
  if (loading) {
    return <Loader size="lg" text="Loading groups..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No groups available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id || group.name} padding="sm">
          <Card.Header>
            <h3 className="text-base font-bold text-gray-100">
              {group.name || `Group ${group.letter}`}
            </h3>
          </Card.Header>
          <Card.Body className="p-0">
            <GroupTable group={group} />
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default GroupStageView;
