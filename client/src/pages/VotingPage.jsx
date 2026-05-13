import { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, Button, Loader, Modal } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import votingService from '@/features/voting/services/votingService';
import { useToast } from '@/hooks/useToast';

// Trophy celebration overlay
function TrophyCelebration({ teamName, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onDone}>
      <div className="text-center relative">
        {/* Confetti */}
        <div className="absolute inset-0 -inset-x-20 -top-20 overflow-hidden pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${5 + Math.random() * 90}%`,
                backgroundColor: ['#D4AF37','#FFD700','#FFA500','#FF6347','#4169E1','#32CD32','#FF69B4','#00CED1'][i % 8],
                animationDelay: `${Math.random() * 0.6}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`,
              }}
            />
          ))}
        </div>

        {/* Glow */}
        <div className="absolute inset-0 -inset-20 bg-fifa-gold/10 rounded-full blur-3xl animate-pulse" />

        {/* Trophy */}
        <div className="relative animate-trophy-enter">
          <div className="text-[100px] leading-none mb-3">🏆</div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-1 animate-slide-up">
          {teamName}
        </h2>
        <p className="text-fifa-gold text-base font-bold animate-slide-up" style={{ animationDelay: '0.15s' }}>
          World Cup Champions!
        </p>
        <p className="text-gray-400 text-sm mt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Tap anywhere to close
        </p>
      </div>
    </div>
  );
}

export default function VotingPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [votingId, setVotingId] = useState(null);
  const [celebration, setCelebration] = useState(null);

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

  const handleVote = async (option) => {
    if (!isAuthenticated) {
      showToast('Please log in to vote', 'warning');
      return;
    }
    setVotingId(option.id);
    try {
      const res = await votingService.castVote(selectedPoll.id, option.id);
      const d = res.data.data;
      const updatedPoll = d?.poll || d;
      setSelectedPoll(null);
      setCelebration(option.option_text);
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
      {celebration && <TrophyCelebration teamName={celebration} onDone={() => setCelebration(null)} />}

      {polls.length === 0 ? (
        <div className="text-center py-12"><p className="text-gray-400">No polls available yet.</p></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} hoverable onClick={() => openPoll(poll.id)} className="flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🗳️</span>
                  <h3 className="text-base font-semibold text-white leading-tight">{poll.title}</h3>
                </div>
                {poll.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{poll.description}</p>}
                <span className="text-gray-500 text-xs">{poll.option_count || 0} options</span>
              </div>
              <div className="mt-4">
                <Button variant="gold" size="sm" fullWidth>Vote Now</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedPoll} onClose={() => setSelectedPoll(null)} title="" size="md">
        {selectedPoll && (() => {
          const options = selectedPoll.options || [];
          const totalVotes = options.reduce((s, o) => s + (o.vote_count || 0), 0);
          const maxCount = Math.max(...options.map(o => o.vote_count || 0), 0);
          const userVote = selectedPoll.user_vote;

          return (
            <div>
              <div className="text-center mb-6">
                <span className="text-4xl mb-2 block">🏆</span>
                <h3 className="text-lg font-bold text-white">{selectedPoll.title}</h3>
                {selectedPoll.description && <p className="text-gray-400 text-sm mt-1">{selectedPoll.description}</p>}
              </div>

              <div className="space-y-2.5">
                {options.map((option) => {
                  const count = option.vote_count || 0;
                  const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  const isTop = count === maxCount && count > 0;
                  const isUserVote = userVote === option.id;
                  const isVoting = votingId === option.id;

                  return (
                    <button key={option.id} onClick={() => isAuthenticated && handleVote(option)}
                      disabled={!isAuthenticated || !!votingId}
                      className={`w-full text-left rounded-2xl p-4 transition-all duration-300 border ${
                        isUserVote
                          ? 'border-fifa-gold/40 bg-gradient-to-r from-fifa-gold/10 to-yellow-500/5 shadow-lg shadow-fifa-gold/5'
                          : 'border-white/[0.06] bg-white/[0.03] active:scale-[0.97]'
                      } ${isVoting ? 'animate-pulse' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isUserVote ? 'border-fifa-gold bg-fifa-gold' : 'border-gray-600'
                          }`}>
                            {isUserVote && (
                              <svg className="w-3 h-3 text-fifa-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-semibold ${isUserVote ? 'text-fifa-gold' : 'text-gray-200'}`}>
                            {option.option_text}
                          </span>
                        </div>
                        <span className={`text-sm font-bold tabular-nums ${isTop ? 'text-fifa-gold' : 'text-gray-500'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isUserVote ? 'bg-gradient-to-r from-fifa-gold to-yellow-400' : isTop ? 'bg-fifa-gold/50' : 'bg-primary-600/50'
                        }`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-gray-600">{count} vote{count !== 1 ? 's' : ''}</span>
                        {isUserVote && <span className="text-[10px] text-fifa-gold font-semibold">Your pick ✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] text-center">
                <p className="text-gray-500 text-xs">
                  {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
                  {isAuthenticated && userVote && ' · Tap another option to change'}
                  {isAuthenticated && !userVote && ' · Tap to cast your vote'}
                </p>
                {!isAuthenticated && <p className="text-primary-400 text-sm font-medium mt-2">Log in to vote</p>}
              </div>
            </div>
          );
        })()}
      </Modal>
    </PageLayout>
  );
}
