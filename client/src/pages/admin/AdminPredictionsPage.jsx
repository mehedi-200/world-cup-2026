import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge, Loader } from '@/components/ui';
import adminService from '@/features/admin/services/adminService';
import { useToast } from '@/hooks/useToast';

export default function AdminPredictionsPage() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoringAll, setScoringAll] = useState(false);
  const [scoringId, setScoringId] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getMatches({ status: 'completed', limit: 50 });
      const data = res.data?.data;
      setMatches(Array.isArray(data) ? data : data?.matches || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminService.getStats();
      setStats(res.data?.data || res.data || null);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    fetchStats();
  }, [fetchMatches, fetchStats]);

  const handleScoreMatch = async (matchId) => {
    try {
      setScoringId(matchId);
      await adminService.scorePredictions(matchId);
      showToast('Predictions scored successfully', 'success');
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to score predictions', 'error');
    } finally {
      setScoringId(null);
    }
  };

  const handleScoreAll = async () => {
    try {
      setScoringAll(true);
      await adminService.scoreAllPredictions();
      showToast('All predictions scored successfully', 'success');
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to score all predictions', 'error');
    } finally {
      setScoringAll(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Score Predictions</h1>
        <Button variant="gold" size="lg" isLoading={scoringAll} onClick={handleScoreAll}>
          Score All Predictions
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-white">{stats?.predictions ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Total Predictions</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-white">{stats?.completedMatches ?? stats?.completed_matches ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Completed Matches</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-white">{stats?.users ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Total Users</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-fifa-gold">{matches.length}</p>
          <p className="text-xs text-gray-400 mt-1">Matches to Score</p>
        </Card>
      </div>

      {/* Matches List */}
      <Card padding="md">
        <Card.Header>
          <h2 className="text-lg font-semibold text-white">Completed Matches</h2>
        </Card.Header>
        <Card.Body>
          {loading && <Loader size="lg" text="Loading matches..." />}
          {error && <p className="text-center text-red-400 py-6">{error}</p>}
          {!loading && !error && matches.length === 0 && (
            <p className="text-center text-gray-400 py-8">No completed matches to score.</p>
          )}
          {!loading && !error && matches.length > 0 && (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-4 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold">
                        {match.home_team_name || 'TBD'} vs {match.away_team_name || 'TBD'}
                      </span>
                      {match.home_score != null && match.away_score != null && (
                        <span className="font-mono font-bold text-fifa-gold">
                          {match.home_score} - {match.away_score}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="neutral" size="sm">{match.stage?.replace(/_/g, ' ') || 'N/A'}</Badge>
                      <Badge variant="success" size="sm">Completed</Badge>
                      {match.match_date && (
                        <span className="text-xs text-gray-500">{new Date(match.match_date).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={scoringId === match.id}
                    onClick={() => handleScoreMatch(match.id)}
                  >
                    Score
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
