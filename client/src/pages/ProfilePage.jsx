import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, Tabs, Loader, Badge } from '@/components/ui';
import { ProtectedRoute } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PredictionHistory } from '@/features/predictions';
import { usePredictions } from '@/features/predictions/hooks/usePredictions';
import leaderboardService from '@/features/leaderboard/services/leaderboardService';
import quizService from '@/features/quiz/services/quizService';
import authService from '@/features/auth/services/authService';

const tabs = [
  { key: 'stats', label: 'Stats' },
  { key: 'predictions', label: 'Predictions' },
  { key: 'quizzes', label: 'Quizzes' },
];

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const { predictions, loading: predLoading } = usePredictions();
  const [activeTab, setActiveTab] = useState('stats');
  const [myRank, setMyRank] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [freshUser, setFreshUser] = useState(null);

  useEffect(() => {
    // Fetch fresh user data + rank + quiz history
    Promise.all([
      authService.getMe().then(r => {
        const u = r.data.data?.user || r.data.data;
        setFreshUser(u);
        if (u) updateUser(u);
      }).catch(() => {}),
      leaderboardService.getMyRank().then(r => {
        const d = r.data.data;
        setMyRank(d?.user || d);
      }).catch(() => {}),
      quizService.getHistory().then(r => {
        const d = r.data.data;
        setQuizHistory(Array.isArray(d) ? d : d?.history || []);
      }).catch(() => {}),
    ]);
  }, []);

  const displayUser = freshUser || user;
  const points = displayUser?.total_points || 0;
  const predCount = predictions?.length || 0;
  const quizCount = quizHistory.length;
  const quizPoints = quizHistory.reduce((s, q) => s + (q.score || 0) * 10, 0);

  return (
    <PageLayout title="Profile">
      <div className="max-w-lg mx-auto">
        {/* User card */}
        <div className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-3xl p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fifa-maroon to-fifa-blue border-2 border-white/10 flex items-center justify-center text-3xl font-bold text-white uppercase mx-auto mb-3">
            {displayUser?.username?.[0] || 'U'}
          </div>
          <h2 className="text-xl font-bold text-white">{displayUser?.username}</h2>
          <p className="text-gray-500 text-sm">{displayUser?.email}</p>

          {/* Points badge */}
          <div className="inline-flex items-center gap-2 bg-fifa-gold/10 border border-fifa-gold/20 rounded-2xl px-5 py-2.5 mt-4">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-2xl font-black text-fifa-gold">{points}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium -mt-0.5">Total Points</p>
            </div>
          </div>

          {/* Rank */}
          {myRank?.rank && (
            <p className="text-gray-400 text-sm mt-2">
              Ranked <span className="text-white font-bold">#{myRank.rank}</span> on leaderboard
            </p>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">{predCount}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Predictions</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-white">{quizCount}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Quizzes</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-fifa-gold">{myRank?.rank || '-'}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rank</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

        <div className="mt-4">
          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">⚽</span>
                  <h3 className="text-sm font-semibold text-white">Match Predictions</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xl font-bold text-white">{predCount}</p><p className="text-xs text-gray-500">Total made</p></div>
                  <div><p className="text-xl font-bold text-fifa-gold">{predictions?.filter(p => p.points_earned > 0).length || 0}</p><p className="text-xs text-gray-500">Correct</p></div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">🧠</span>
                  <h3 className="text-sm font-semibold text-white">Quiz Results</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xl font-bold text-white">{quizCount}</p><p className="text-xs text-gray-500">Completed</p></div>
                  <div><p className="text-xl font-bold text-fifa-gold">{quizPoints}</p><p className="text-xs text-gray-500">Points earned</p></div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">📊</span>
                  <h3 className="text-sm font-semibold text-white">Overall</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xl font-bold text-fifa-gold">{points}</p><p className="text-xs text-gray-500">Total points</p></div>
                  <div><p className="text-xl font-bold text-white">#{myRank?.rank || '-'}</p><p className="text-xs text-gray-500">Leaderboard</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <PredictionHistory predictions={predictions} loading={predLoading} />
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-3">
              {quizHistory.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl block mb-2">🧠</span>
                  <p className="text-gray-400">No quizzes completed yet</p>
                  <p className="text-gray-500 text-sm mt-1">Take a quiz to see your results here!</p>
                </div>
              ) : (
                quizHistory.map((attempt) => (
                  <div key={attempt.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">{attempt.quiz_title || 'Quiz'}</h4>
                      <Badge variant={attempt.score >= attempt.total_questions * 0.8 ? 'success' : attempt.score >= attempt.total_questions * 0.5 ? 'warning' : 'danger'} size="sm">
                        {Math.round((attempt.score / (attempt.total_questions || 1)) * 100)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{attempt.score}/{attempt.total_questions} correct</span>
                      <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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
