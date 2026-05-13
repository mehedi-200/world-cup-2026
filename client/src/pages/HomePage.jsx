import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Loader } from '@/components/ui';
import { MatchCard } from '@/features/matches';
import matchService from '@/features/matches/services/matchService';

export default function HomePage() {
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [liveRes, upcomingRes] = await Promise.all([
          matchService.getLive(),
          matchService.getAll({ status: 'scheduled', limit: 6 }),
        ]);
        const liveData = liveRes.data.data;
        setLiveMatches(Array.isArray(liveData) ? liveData : liveData?.matches || []);
        const upData = upcomingRes.data.data;
        setUpcomingMatches(Array.isArray(upData) ? upData : upData?.matches || []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading World Cup..." /></div>;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-fifa-maroon/30 via-fifa-dark to-fifa-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-fifa-gold/5 rounded-full blur-3xl" />

        <div className="relative px-4 pt-12 pb-10 md:pt-20 md:pb-16 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-300 font-medium">Live Tournament</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-2 tracking-tight">
            <span className="text-gradient">FIFA World Cup</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-fifa-gold/50" />
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-widest">2 0 2 6</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-fifa-gold/50" />
          </div>
          <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            USA &bull; Mexico &bull; Canada
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/matches">
              <Button variant="gold" size="lg">View Matches</Button>
            </Link>
            <Link to="/predictions">
              <Button variant="secondary" size="lg">Make Predictions</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              </div>
              <h2 className="text-xl font-bold text-white">Live Now</h2>
              <span className="text-xs text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-full">{liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} onClick={(id) => navigate(`/matches/${id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-white">Upcoming</h2>
            <Link to="/matches" className="text-fifa-gold hover:text-yellow-300 text-sm font-medium transition-colors">
              See all &rarr;
            </Link>
          </div>
          {upcomingMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} onClick={(id) => navigate(`/matches/${id}`)} />
              ))}
            </div>
          ) : (
            <Card padding="lg">
              <p className="text-gray-500 text-center">No upcoming matches scheduled yet.</p>
            </Card>
          )}
        </section>

        {/* Feature Cards */}
        <section>
          <h2 className="text-xl font-bold text-white mb-5">Explore</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Groups', desc: 'Standings & tables', link: '/groups', gradient: 'from-blue-600/20 to-blue-900/10', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { title: 'Predictions', desc: 'Predict & earn points', link: '/predictions', gradient: 'from-purple-600/20 to-purple-900/10', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { title: 'Leaderboard', desc: 'Top predictors', link: '/leaderboard', gradient: 'from-yellow-600/20 to-yellow-900/10', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { title: 'Quiz', desc: 'Test your knowledge', link: '/quizzes', gradient: 'from-green-600/20 to-green-900/10', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
            ].map((item) => (
              <Link key={item.link} to={item.link}>
                <div className={`bg-gradient-to-br ${item.gradient} border border-white/10 rounded-2xl p-4 md:p-5 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 group`}>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white text-sm md:text-base">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
