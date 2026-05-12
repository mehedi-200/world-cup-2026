import { PageLayout } from '@/components/layout';
import { LeaderboardTable, UserRankCard } from '@/features/leaderboard';
import { useLeaderboard } from '@/features/leaderboard/hooks/useLeaderboard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useState, useEffect } from 'react';
import leaderboardService from '@/features/leaderboard/services/leaderboardService';

export default function LeaderboardPage() {
  const { leaderboard, loading, error } = useLeaderboard();
  const { isAuthenticated } = useAuth();
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      leaderboardService.getMyRank()
        .then((res) => {
          const d = res.data.data;
          setMyRank(d?.user || d);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  return (
    <PageLayout title="Leaderboard" subtitle="Top predictors in the World Cup 2026">
      {myRank && (
        <div className="mb-8">
          <UserRankCard rank={myRank.rank} user={myRank} />
        </div>
      )}
      <LeaderboardTable leaderboard={leaderboard} loading={loading} error={error} />
    </PageLayout>
  );
}
