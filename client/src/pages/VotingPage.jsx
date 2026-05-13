import { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '@/components/layout';
import { Loader } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import votingService from '@/features/voting/services/votingService';
import { useToast } from '@/hooks/useToast';

function TrophyCelebration({ teamName, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onDone}>
      <div className="text-center relative">
        <div className="absolute inset-0 -inset-x-20 -top-20 overflow-hidden pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{ left: `${5+Math.random()*90}%`, backgroundColor: ['#D4AF37','#FFD700','#FFA500','#FF6347','#4169E1','#32CD32','#FF69B4','#00CED1'][i%8], animationDelay: `${Math.random()*0.6}s`, animationDuration: `${1.5+Math.random()}s` }} />
          ))}
        </div>
        <div className="absolute inset-0 -inset-20 bg-fifa-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative animate-trophy-enter"><div className="text-[100px] leading-none mb-3">🏆</div></div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1 animate-slide-up">{teamName}</h2>
        <p className="text-fifa-gold text-base font-bold animate-slide-up" style={{ animationDelay: '0.15s' }}>World Cup Champions!</p>
        <p className="text-gray-400 text-sm mt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>Tap anywhere to close</p>
      </div>
    </div>
  );
}

function PollCard({ poll, onVote, votingId, isAuthenticated }) {
  const options = poll.options || [];
  const totalVotes = options.reduce((s, o) => s + (o.vote_count || 0), 0);
  const maxCount = Math.max(...options.map(o => o.vote_count || 0), 0);
  const userVote = poll.user_vote;

  return (
    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">🗳️</span>
          <div>
            <h3 className="text-base font-bold text-white leading-snug">{poll.title}</h3>
            {poll.description && <p className="text-gray-500 text-xs mt-1">{poll.description}</p>}
          </div>
        </div>
        {userVote && (
          <div className="mt-3 flex items-center gap-2 bg-fifa-gold/10 border border-fifa-gold/20 rounded-xl px-3 py-2">
            <span className="text-sm">🏆</span>
            <span className="text-xs text-fifa-gold font-semibold">
              You voted: {options.find(o => o.id === userVote)?.option_text || '—'}
            </span>
            <span className="text-[10px] text-gray-500 ml-auto">tap to change</span>
          </div>
        )}
      </div>

      <div className="px-3 pb-3 space-y-1.5">
        {options.map((option) => {
          const count = option.vote_count || 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isTop = count === maxCount && count > 0;
          const isMyVote = userVote === option.id;
          const isVoting = votingId === option.id;

          return (
            <button key={option.id} onClick={() => onVote(poll.id, option)}
              disabled={!isAuthenticated || !!votingId}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-200 ${
                isMyVote
                  ? 'bg-gradient-to-r from-fifa-gold/15 to-fifa-gold/5 border border-fifa-gold/30'
                  : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.05] active:scale-[0.98]'
              } ${isVoting ? 'opacity-60' : ''}`}
            >
              <div className={`w-[18px] h-[18px] rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                isMyVote ? 'border-fifa-gold bg-fifa-gold' : 'border-gray-600'
              }`}>
                {isMyVote && (
                  <svg className="w-2.5 h-2.5 text-fifa-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium truncate ${isMyVote ? 'text-fifa-gold' : 'text-gray-300'}`}>
                    {option.option_text}
                  </span>
                  <span className={`text-xs font-bold tabular-nums ml-2 shrink-0 ${isTop ? 'text-fifa-gold' : 'text-gray-600'}`}>
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-[5px] bg-white/[0.05] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isMyVote ? 'bg-gradient-to-r from-fifa-gold to-yellow-400' : isTop ? 'bg-fifa-gold/40' : 'bg-primary-600/40'
                  }`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-[11px] text-gray-600">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
        {!isAuthenticated && <span className="text-[11px] text-primary-400 font-medium">Log in to vote</span>}
        {isAuthenticated && !userVote && <span className="text-[11px] text-gray-500">Tap an option to vote</span>}
        {isAuthenticated && userVote && <span className="text-[11px] text-gray-500">Tap another to change</span>}
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
        <div className="space-y-5 max-w-2xl mx-auto">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} onVote={handleVote} votingId={votingId} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
