import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Loader, Badge } from '@/components/ui';
import { PageLayout } from '@/components/layout';
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

  if (loading) return <Loader size="lg" text="Loading World Cup..." />;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-fifa-maroon/20 via-fifa-dark to-fifa-blue/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            <span className="text-gradient">FIFA World Cup</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            2026
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            USA, Mexico & Canada. Predict matches, compete on the leaderboard,
            and test your football knowledge.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/matches">
              <Button variant="gold" size="lg">View Matches</Button>
            </Link>
            <Link to="/predictions">
              <Button variant="secondary" size="lg">Make Predictions</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-live" />
              <h2 className="text-2xl font-bold text-white">Live Now</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} onClick={(id) => navigate(`/matches/${id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Upcoming Matches</h2>
            <Link to="/matches" className="text-primary-400 hover:text-primary-300 text-sm">
              View all &rarr;
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
              <p className="text-gray-400 text-center">No upcoming matches scheduled.</p>
            </Card>
          )}
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Explore</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Groups', desc: 'View group standings', link: '/groups', icon: '🏟️' },
              { title: 'Predictions', desc: 'Predict match outcomes', link: '/predictions', icon: '🔮' },
              { title: 'Leaderboard', desc: 'Top predictors', link: '/leaderboard', icon: '🏆' },
              { title: 'Quiz', desc: 'Test your knowledge', link: '/quizzes', icon: '🧠' },
            ].map((item) => (
              <Link key={item.link} to={item.link}>
                <Card hoverable padding="md">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
