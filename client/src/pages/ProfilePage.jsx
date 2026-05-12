import { PageLayout } from '@/components/layout';
import { Card, Avatar, Tabs } from '@/components/ui';
import { ProtectedRoute } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PredictionHistory } from '@/features/predictions';
import { usePredictions } from '@/features/predictions/hooks/usePredictions';
import { UserRankCard } from '@/features/leaderboard';
import { useState, useEffect } from 'react';
import leaderboardService from '@/features/leaderboard/services/leaderboardService';

const tabs = [
  { key: 'predictions', label: 'Predictions' },
  { key: 'stats', label: 'Stats' },
];

function ProfileContent() {
  const { user } = useAuth();
  const { predictions, loading } = usePredictions();
  const [activeTab, setActiveTab] = useState('predictions');
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    leaderboardService.getMyRank()
      .then((res) => setMyRank(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <PageLayout title="Profile">
      <Card padding="lg" className="mb-8">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar_url} fallback={user.username} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-fifa-gold font-semibold mt-1">{user.total_points} points</p>
          </div>
        </div>
      </Card>

      {myRank && (
        <div className="mb-8">
          <UserRankCard rank={myRank} />
        </div>
      )}

      <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === 'predictions' && (
          <PredictionHistory predictions={predictions} loading={loading} />
        )}
        {activeTab === 'stats' && (
          <Card padding="md">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{predictions?.length || 0}</p>
                <p className="text-sm text-gray-400">Predictions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-fifa-gold">{user.total_points}</p>
                <p className="text-sm text-gray-400">Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{myRank?.rank || '-'}</p>
                <p className="text-sm text-gray-400">Rank</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
