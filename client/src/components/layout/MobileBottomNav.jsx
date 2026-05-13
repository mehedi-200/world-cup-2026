import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const primaryTabs = [
  {
    to: '/',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    fillIcon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    end: true,
  },
  {
    to: '/matches',
    label: 'Matches',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    fillIcon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    to: '/predictions',
    label: 'Predict',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    fillIcon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    to: '/leaderboard',
    label: 'Ranking',
    icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    fillIcon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
];

const moreItems = [
  {
    to: '/groups',
    label: 'Groups',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    to: '/quizzes',
    label: 'Quizzes',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    to: '/polls',
    label: 'Polls',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
];

const adminItem = {
  to: '/admin',
  label: 'Admin Panel',
  icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
};

const signInItem = {
  to: '/login',
  label: 'Sign In',
  icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
};

export default function MobileBottomNav() {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Don't show on admin pages or login/register
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  // Build more menu items dynamically
  const allMoreItems = [
    ...moreItems,
    ...(isAuthenticated && user?.role === 'admin' ? [adminItem] : []),
    ...(!isAuthenticated ? [signInItem] : []),
  ];

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute bottom-16 left-2 right-2 bg-fifa-darker/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 space-y-0.5 animate-slide-up shadow-2xl shadow-black/40">
            {allMoreItems.map((item) => (
              <button
                key={item.to}
                onClick={() => {
                  navigate(item.to);
                  setShowMore(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  location.pathname === item.to
                    ? 'text-fifa-gold bg-fifa-gold/10'
                    : 'text-gray-200 hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
        {/* Top gradient glow line */}
        <div className="h-px bg-gradient-to-r from-transparent via-fifa-gold/20 to-transparent" />
        <div className="h-16 bg-gradient-to-t from-fifa-darker via-fifa-darker/98 to-fifa-darker/95 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="flex items-center justify-around h-full px-1">
            {primaryTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] rounded-xl transition-all duration-200 ${
                    isActive ? 'text-fifa-gold' : 'text-gray-500 active:text-gray-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Gold dot indicator above icon */}
                    {isActive && (
                      <span className="absolute -top-1 w-1 h-1 rounded-full bg-fifa-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                    )}
                    <svg
                      className={`transition-all duration-200 ${
                        isActive ? 'w-6 h-6 scale-110' : 'w-6 h-6'
                      }`}
                      fill={isActive ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={isActive ? 1.8 : 1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={isActive ? tab.fillIcon : tab.icon} />
                    </svg>
                    <span
                      className={`text-[10px] leading-none transition-all duration-200 ${
                        isActive ? 'font-semibold' : 'font-medium'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

            {/* More button */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] rounded-xl transition-all duration-200 ${
                showMore ? 'text-fifa-gold' : 'text-gray-500 active:text-gray-300'
              }`}
            >
              {showMore && (
                <span className="absolute -top-1 w-1 h-1 rounded-full bg-fifa-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
              )}
              <svg
                className={`transition-all duration-200 ${showMore ? 'w-6 h-6 scale-110' : 'w-6 h-6'}`}
                fill={showMore ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={showMore ? 1.8 : 1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              <span className={`text-[10px] leading-none ${showMore ? 'font-semibold' : 'font-medium'}`}>
                More
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
