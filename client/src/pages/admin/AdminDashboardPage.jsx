import { useNavigate } from 'react-router-dom';
import { useAdminStats } from '@/features/admin/hooks/useAdminStats';
import StatCard from '@/features/admin/components/StatCard';
import ActivityFeed from '@/features/admin/components/ActivityFeed';
import { Card, Button, Loader } from '@/components/ui';

export default function AdminDashboardPage() {
  const { stats, activity, loading, error } = useAdminStats();
  const navigate = useNavigate();

  if (loading) return <Loader size="lg" text="Loading dashboard..." />;
  if (error) return <div className="text-center py-12"><p className="text-red-400">{error}</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        <StatCard label="Users" value={stats?.users} color="primary" icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        <StatCard label="Matches" value={stats?.matches} color="green" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <StatCard label="Active Quizzes" value={stats?.activeQuizzes} color="purple" icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        <StatCard label="Live Matches" value={stats?.liveMatches} color="red" icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Activity Feed */}
        <Card padding="md">
          <Card.Header>
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </Card.Header>
          <Card.Body>
            <ActivityFeed activities={activity} />
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card padding="md">
          <Card.Header>
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary" onClick={() => navigate('/admin/matches')} fullWidth>Manage Matches</Button>
              <Button variant="primary" onClick={() => navigate('/admin/quizzes')} fullWidth>Create Quiz</Button>
              <Button variant="primary" onClick={() => navigate('/admin/polls')} fullWidth>Create Poll</Button>
              <Button variant="gold" onClick={() => navigate('/admin/predictions')} fullWidth>Score Predictions</Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xl font-bold text-white">{stats?.predictions || 0}</p>
                <p className="text-xs text-gray-400">Predictions</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xl font-bold text-white">{stats?.teams || 0}</p>
                <p className="text-xs text-gray-400">Teams</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xl font-bold text-white">{stats?.groups || 0}</p>
                <p className="text-xs text-gray-400">Groups</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xl font-bold text-fifa-gold">{stats?.completedMatches || 0}</p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
