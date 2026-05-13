import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const primaryTabs = [
  { to: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/matches', label: 'Matches', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/predictions', label: 'Predict', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { to: '/leaderboard', label: 'Ranking', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const moreMenuItems = [
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

  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const goTo = (path) => { navigate(path); setShowMore(false); };

  return (
    <>
      {/* More menu */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-[68px] left-3 right-3 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-fifa-darker border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {moreMenuItems.map((item) => (
                <button
                  key={item.to}
                  onClick={() => goTo(item.to)}
                  className={`w-full text-left px-5 py-3.5 text-sm border-b border-white/[0.05] last:border-b-0 transition-colors ${
                    location.pathname === item.to
                      ? 'text-fifa-gold bg-fifa-gold/[0.06]'
                      : 'text-gray-200 active:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {isAuthenticated && user?.role === 'admin' && (
                <button
                  onClick={() => goTo('/admin')}
                  className="w-full text-left px-5 py-3.5 text-sm text-fifa-gold border-t border-white/[0.05] active:bg-white/[0.06] transition-colors"
                >
                  Admin Panel
                </button>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => goTo('/login')}
                  className="w-full text-left px-5 py-3.5 text-sm text-primary-400 border-t border-white/[0.05] active:bg-white/[0.06] transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
        <div className="h-px bg-gradient-to-r from-transparent via-fifa-gold/20 to-transparent" />
        <div className="h-16 bg-fifa-darker/95 backdrop-blur-xl">
          <div className="flex items-center justify-around h-full px-2">
            {primaryTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] transition-all duration-200 ${
                    isActive ? 'text-fifa-gold' : 'text-gray-500 active:text-gray-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -top-1.5 w-1 h-1 rounded-full bg-fifa-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />}
                    <svg className="w-6 h-6" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 0 : 1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                    <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* More tab */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] transition-all duration-200 ${
                showMore ? 'text-fifa-gold' : 'text-gray-500 active:text-gray-300'
              }`}
            >
              {showMore && <span className="absolute -top-1.5 w-1 h-1 rounded-full bg-fifa-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />}
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
              </svg>
              <span className={`text-[10px] leading-none ${showMore ? 'font-bold' : 'font-medium'}`}>More</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
