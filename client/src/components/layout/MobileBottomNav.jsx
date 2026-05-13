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
  { to: '/groups', label: 'Groups', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
  { to: '/quizzes', label: 'Quizzes', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', iconBg: 'bg-purple-500/15', iconColor: 'text-purple-400' },
  { to: '/polls', label: 'Polls', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', iconBg: 'bg-green-500/15', iconColor: 'text-green-400' },
  { to: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', iconBg: 'bg-orange-500/15', iconColor: 'text-orange-400' },
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

  // Build extra items
  const extraItems = [];
  if (isAuthenticated && user?.role === 'admin') {
    extraItems.push({ to: '/admin', label: 'Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', iconBg: 'bg-fifa-gold/15', iconColor: 'text-fifa-gold' });
  }
  if (!isAuthenticated) {
    extraItems.push({ to: '/login', label: 'Login', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1', iconBg: 'bg-primary-500/15', iconColor: 'text-primary-400' });
  }

  const allItems = [...moreItems, ...extraItems];

  return (
    <>
      {/* More menu */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-[68px] left-3 right-3 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-fifa-darker/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-2.5 shadow-xl">
              <div className={`grid gap-2 ${allItems.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
                {allItems.map((item) => (
                  <button
                    key={item.to}
                    onClick={() => goTo(item.to)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl active:scale-90 transition-all duration-150 ${
                      location.pathname === item.to
                        ? 'bg-fifa-gold/10 ring-1 ring-fifa-gold/25'
                        : 'active:bg-white/[0.06]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                      <svg className={`w-5 h-5 ${location.pathname === item.to ? 'text-fifa-gold' : item.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <span className={`text-[10px] font-medium leading-none ${
                      location.pathname === item.to ? 'text-fifa-gold' : 'text-gray-400'
                    }`}>{item.label}</span>
                  </button>
                ))}
              </div>
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
