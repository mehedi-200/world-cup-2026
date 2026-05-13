import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const primaryTabs = [
  { to: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/matches', label: 'Matches', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/predictions', label: 'Predict', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { to: '/leaderboard', label: 'Ranking', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const moreItems = [
  { to: '/groups', label: 'Groups', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', bg: 'bg-[#007AFF]' },
  { to: '/quizzes', label: 'Quizzes', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', bg: 'bg-[#AF52DE]' },
  { to: '/polls', label: 'Polls', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', bg: 'bg-[#34C759]' },
  { to: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', bg: 'bg-[#FF9500]' },
];

export default function MobileBottomNav() {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Close More menu on any navigation
  useEffect(() => { setShowMore(false); }, [location.pathname]);

  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const goTo = (path) => { navigate(path); setShowMore(false); };

  const extraItems = [];
  if (isAuthenticated && user?.is_admin === 1) {
    extraItems.push({ to: '/admin', label: 'Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', bg: 'bg-[#FF3B30]' });
  }
  if (!isAuthenticated) {
    extraItems.push({ to: '/login', label: 'Sign In', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1', bg: 'bg-[#5856D6]' });
  }

  const allItems = [...moreItems, ...extraItems];

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute bottom-0 left-0 right-0 h-[50vh] animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="h-full bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-t-[20px] overflow-hidden shadow-2xl flex flex-col">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2 shrink-0">
                <div className="w-9 h-[5px] rounded-full bg-white/20" />
              </div>
              {/* Title */}
              <div className="px-5 pb-3 shrink-0">
                <h3 className="text-[15px] font-semibold text-white">More</h3>
              </div>
              {/* Grid */}
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                  {allItems.map((item) => (
                    <button key={item.to} onClick={() => goTo(item.to)} className="flex flex-col items-center gap-[7px] active:opacity-60 transition-opacity">
                      <div className={`w-[54px] h-[54px] ${item.bg} rounded-[14px] flex items-center justify-center shadow-sm`}>
                        <svg className="w-[24px] h-[24px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                      </div>
                      <span className="text-[11px] text-[#ebebf0] leading-tight text-center">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
        <div className="h-[50px] bg-[#1c1c1e]/90 backdrop-blur-2xl border-t border-white/[0.08]">
          <div className="flex items-center justify-around h-full">
            {primaryTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-[2px] min-w-[50px] min-h-[44px] ${
                    isActive ? 'text-[#0A84FF]' : 'text-[#8e8e93]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg className="w-[22px] h-[22px]" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 0 : 1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                    <span className="text-[10px]" style={{ fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
                  </>
                )}
              </NavLink>
            ))}

            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex flex-col items-center justify-center gap-[2px] min-w-[50px] min-h-[44px] ${
                showMore ? 'text-[#0A84FF]' : 'text-[#8e8e93]'
              }`}
            >
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="19" cy="12" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-[10px]" style={{ fontWeight: showMore ? 600 : 400 }}>More</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
