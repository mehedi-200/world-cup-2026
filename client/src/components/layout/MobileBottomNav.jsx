import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const primaryTabs = [
  { to: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/matches', label: 'Matches', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/predictions', label: 'Predict', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { to: '/leaderboard', label: 'Ranking', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const moreItems = [
  { to: '/groups', label: 'Groups' },
  { to: '/quizzes', label: 'Quizzes' },
  { to: '/polls', label: 'Polls' },
  { to: '/profile', label: 'Profile' },
];

export default function MobileBottomNav() {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Don't show on admin pages or login/register
  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-16 left-0 right-0 bg-fifa-darker border-t border-white/10 rounded-t-2xl p-3 space-y-1 animate-slide-up">
            {moreItems.map((item) => (
              <button
                key={item.to}
                onClick={() => { navigate(item.to); setShowMore(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  location.pathname === item.to
                    ? 'text-fifa-gold bg-white/10'
                    : 'text-gray-200 active:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAuthenticated && user?.role === 'admin' && (
              <button
                onClick={() => { navigate('/admin'); setShowMore(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-fifa-gold font-medium text-sm active:bg-white/10"
              >
                Admin Panel
              </button>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => { navigate('/login'); setShowMore(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-primary-400 font-medium text-sm active:bg-white/10"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-fifa-darker/95 backdrop-blur-lg border-t border-white/10 z-50 md:hidden safe-bottom">
        <div className="flex items-center justify-around h-full px-1">
          {primaryTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[44px] rounded-lg transition-colors ${
                  isActive ? 'text-fifa-gold' : 'text-gray-500 active:text-gray-300'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[44px] rounded-lg transition-colors ${
              showMore ? 'text-fifa-gold' : 'text-gray-500 active:text-gray-300'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
