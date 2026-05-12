import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '@/components/ui';
import { PageLayout } from '@/components/layout';
import { MatchList } from '@/features/matches';
import { useMatches } from '@/features/matches/hooks/useMatches';

const tabs = [
  { key: 'all', label: 'All Matches' },
  { key: 'live', label: 'Live' },
  { key: 'scheduled', label: 'Upcoming' },
  { key: 'completed', label: 'Results' },
];

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const filters = activeTab === 'all' ? {} : { status: activeTab };
  const { matches, loading, error } = useMatches(filters);

  return (
    <PageLayout title="Matches" subtitle="Browse all FIFA World Cup 2026 matches">
      <div className="mb-6">
        <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
      </div>
      <MatchList
        matches={matches}
        loading={loading}
        error={error}
        onMatchClick={(id) => navigate(`/matches/${id}`)}
      />
    </PageLayout>
  );
}
