import { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, Button, Loader, Modal } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import votingService from '@/features/voting/services/votingService';
import { useToast } from '@/hooks/useToast';

export default function VotingPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [votingId, setVotingId] = useState(null);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await votingService.getAll();
      const d = res.data.data;
      setPolls(Array.isArray(d) ? d : d?.polls || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPolls(); }, [fetchPolls]);

  const openPoll = async (pollId) => {
    try {
      const res = await votingService.getById(pollId);
      const d = res.data.data;
      setSelectedPoll(d?.poll || d);
    } catch {
      showToast('Failed to load poll', 'error');
    }
  };

  const handleVote = async (optionId) => {
    if (!isAuthenticated) {
      showToast('Please log in to vote', 'warning');
      return;
    }
    setVotingId(optionId);
    try {
      const res = await votingService.castVote(selectedPoll.id, optionId);
      const d = res.data.data;
      setSelectedPoll(d?.poll || d);
      showToast('Vote cast!', 'success');
      fetchPolls();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to vote', 'error');
    } finally {
      setVotingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" text="Loading polls..." /></div>;
  if (error) return <div className="text-center py-12"><p className="text-red-400">{error}</p></div>;

  return (
    <PageLayout title="Polls" subtitle="Vote on World Cup topics">
      {polls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No polls available yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} hoverable onClick={() => openPoll(poll.id)} className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{poll.title}</h3>
                {poll.description && <p className="text-gray-400 text-sm mb-3">{poll.description}</p>}
                <span className="text-gray-500 text-sm">{poll.option_count || 0} options</span>
              </div>
              <div className="mt-4">
                <Button variant="primary" size="sm" fullWidth>Vote / Results</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedPoll}
        onClose={() => setSelectedPoll(null)}
        title={selectedPoll?.title || 'Poll'}
        size="md"
      >
        {selectedPoll && (() => {
          const options = selectedPoll.options || [];
          const totalVotes = options.reduce((s, o) => s + (o.vote_count || 0), 0);
          const maxCount = Math.max(...options.map(o => o.vote_count || 0), 0);

          return (
            <div>
              {selectedPoll.description && (
                <p className="text-gray-400 text-sm mb-5">{selectedPoll.description}</p>
              )}
              <div className="space-y-4">
                {options.map((option) => {
                  const count = option.vote_count || 0;
                  const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  const isTop = count === maxCount && count > 0;

                  return (
                    <div key={option.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-200">{option.option_text}</span>
                        <span className="text-xs text-gray-400">{pct}% ({count})</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isTop ? 'bg-fifa-gold' : 'bg-primary-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          fullWidth
                          isLoading={votingId === option.id}
                          onClick={() => handleVote(option.id)}
                        >
                          Vote for this
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-500 text-xs text-center mt-4">
                {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
              </p>
              {!isAuthenticated && (
                <p className="text-center text-gray-500 text-sm mt-3">Log in to vote</p>
              )}
            </div>
          );
        })()}
      </Modal>
    </PageLayout>
  );
}
