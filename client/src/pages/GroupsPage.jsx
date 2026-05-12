import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, Loader, Tabs, Badge } from '@/components/ui';
import { GroupStageView } from '@/features/groups';
import { useGroups } from '@/features/groups/hooks/useGroups';

export default function GroupsPage() {
  const { groups, loading, error } = useGroups();

  return (
    <PageLayout
      title="Groups & Standings"
      subtitle="FIFA World Cup 2026 group standings will appear here once the draw is made. Use Sync to load real competition data."
    >
      {loading ? (
        <Loader size="lg" text="Loading groups..." />
      ) : groups.length > 0 ? (
        <GroupStageView groups={groups} loading={false} error={error} />
      ) : (
        <Card padding="lg" className="text-center">
          <div className="py-8">
            <div className="text-5xl mb-4">🏟️</div>
            <h3 className="text-xl font-bold text-white mb-2">Groups Coming Soon</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              The FIFA World Cup 2026 group draw has not taken place yet.
              Groups and standings will be updated automatically once available.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Meanwhile, check out today's live matches from leagues around the world!
            </p>
          </div>
        </Card>
      )}
    </PageLayout>
  );
}
