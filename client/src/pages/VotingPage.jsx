import { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '@/components/layout';
import { Loader } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import votingService from '@/features/voting/services/votingService';
import { useToast } from '@/hooks/useToast';

/* ─── Trophy celebration ─── */
function TrophyCelebration({ teamName, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" onClick={onDone}>
      <div className="text-center relative px-6">
        <div className="absolute inset-0 -inset-x-20 -top-32 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-confetti"
              style={{
                width: `${4 + Math.random() * 6}px`, height: `${4 + Math.random() * 6}px`,
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#D4AF37','#FFD700','#FFA500','#FF6347','#4169E1','#32CD32','#FF69B4','#00CED1','#9B59B6','#E74C3C'][i % 10],
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${1.5 + Math.random() * 1.5}s`,
              }} />
          ))}
        </div>
        <div className="absolute inset-0 -inset-20 bg-fifa-gold/15 rounded-full blur-[80px] animate-pulse" />
        <div className="relative animate-trophy-enter">
          <div className="text-[120px] leading-none drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">🏆</div>
        </div>
        <h2 className="text-3xl font-black text-white mt-2 animate-slide-up">{teamName}</h2>
        <p className="text-fifa-gold text-lg font-bold mt-1 animate-slide-up" style={{ animationDelay: '0.15s' }}>World Cup Champions!</p>
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <span className="text-gray-500 text-xs bg-white/5 px-4 py-1.5 rounded-full">tap to dismiss</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Single poll card ─── */
function PollCard({ poll, onVote, votingId, isAuthenticated }) {
  const options = poll.options || [];
  const totalVotes = options.reduce((s, o) => s + (o.vote_count || 0), 0);
  const maxCount = Math.max(...options.map(o => o.vote_count || 0), 0);
  const userVote = poll.user_vote;
  const votedOption = options.find(o => o.id === userVote);

  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] shadow-xl shadow-black/20">

      {/* ── Header ── */}
      <div className="relative px-5 pt-6 pb-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fifa-gold/60 via-yellow-400/40 to-fifa-gold/60" />
        <h3 className="text-lg font-bold text-white text-center">{poll.title}</h3>
        {poll.description && (
          <p className="text-gray-500 text-xs text-center mt-1.5 max-w-xs mx-auto">{poll.description}</p>
        )}

        {/* Your vote banner */}
        {votedOption && (
          <div className="mt-4 flex items-center justify-center gap-2 bg-fifa-gold/10 border border-fifa-gold/20 rounded-2xl px-4 py-2.5 mx-auto max-w-xs">
            <span className="text-lg">🏆</span>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Your pick</p>
              <p className="text-sm text-fifa-gold font-bold -mt-0.5">{votedOption.option_text}</p>
            </div>
          </div>
        )}

        {/* Vote count pill */}
        <div className="flex justify-center mt-3">
          <span className="text-[11px] text-gray-500 bg-white/[0.04] px-3 py-1 rounded-full">
            {totalVotes.toLocaleString()} vote{totalVotes !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Options ── */}
      <div className="px-4 pb-4 space-y-2">
        {options.map((option, index) => {
          const count = option.vote_count || 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isTop = count === maxCount && count > 0;
          const isMyVote = userVote === option.id;
          const isVoting = votingId === option.id;

          // Rank medal for top 3
          const medals = ['🥇', '🥈', '🥉'];
          const sortedOpts = [...options].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
          const rank = sortedOpts.findIndex(o => o.id === option.id);

          return (
            <button
              key={option.id}
              onClick={() => onVote(poll.id, option)}
              disabled={!isAuthenticated || !!votingId}
              className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.97] ${
                isVoting ? 'opacity-60 scale-[0.98]' : ''
              }`}
            >
              {/* Background fill */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${
                    isMyVote
                      ? 'bg-gradient-to-r from-fifa-gold/20 to-fifa-gold/5'
                      : isTop
                        ? 'bg-gradient-to-r from-fifa-gold/10 to-transparent'
                        : 'bg-gradient-to-r from-white/[0.04] to-transparent'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className={`relative flex items-center gap-3 px-4 py-3.5 border rounded-2xl ${
                isMyVote
                  ? 'border-fifa-gold/30'
                  : 'border-white/[0.05]'
              }`}>
                {/* Medal / Radio */}
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                  {rank < 3 && count > 0 ? (
                    <span className="text-xl">{medals[rank]}</span>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isMyVote ? 'border-fifa-gold bg-fifa-gold' : 'border-gray-600'
                    }`}>
                      {isMyVote && (
                        <svg className="w-3 h-3 text-fifa-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0 text-left">
                  <span className={`text-sm font-semibold ${isMyVote ? 'text-fifa-gold' : 'text-gray-200'}`}>
                    {option.option_text}
                  </span>
                  {isMyVote && <span className="text-[10px] text-fifa-gold/70 ml-1.5">✓ voted</span>}
                </div>

                {/* Percentage */}
                <div className="text-right shrink-0">
                  <span className={`text-base font-bold tabular-nums ${isTop ? 'text-fifa-gold' : 'text-gray-500'}`}>
                    {pct}%
                  </span>
                  <p className="text-[10px] text-gray-600">{count.toLocaleString()}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-white/[0.04] text-center">
        {!isAuthenticated && <span className="text-xs text-primary-400 font-medium">Log in to vote</span>}
        {isAuthenticated && !userVote && <span className="text-xs text-gray-500">Tap an option to cast your vote</span>}
        {isAuthenticated && userVote && <span className="text-xs text-gray-500">Tap another option to change your vote</span>}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function VotingPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleVote = async (pollId, option) => {
    if (!isAuthenticated) { showToast('Please log in to vote', 'warning'); return; }
    setVotingId(option.id);
    try {
      await votingService.castVote(pollId, option.id);
      setCelebration(option.option_text);
      await fetchPolls();
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
        <div className="space-y-6 max-w-lg mx-auto">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} onVote={handleVote} votingId={votingId} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
