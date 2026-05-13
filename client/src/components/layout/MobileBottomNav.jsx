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
  { to: '/groups', label: 'Groups', desc: 'Standings & tables', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'from-blue-500/20 to-blue-600/10', iconBg: 'bg-blue-500/20 text-blue-400' },
  { to: '/quizzes', label: 'Quizzes', desc: 'Test your knowledge', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'from-purple-500/20 to-purple-600/10', iconBg: 'bg-purple-500/20 text-purple-400' },
  { to: '/polls', label: 'Polls', desc: 'Vote & share opinion', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'from-green-500/20 to-green-600/10', iconBg: 'bg-green-500/20 text-green-400' },
  { to: '/profile', label: 'Profile', desc: 'Your account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'from-orange-500/20 to-orange-600/10', iconBg: 'bg-orange-500/20 text-orange-400' },
];

export default function MobileBottomNav() {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="absolute bottom-[68px] left-3 right-3 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            {/* Menu panel */}
            <div className="bg-fifa-darker/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="px-5 pt-4 pb-2 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">More</h3>
                  <button
                    onClick={() => setShowMore(false)}
                    className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-gray-400 active:bg-white/10"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Grid of menu items */}
              <div className="grid grid-cols-2 gap-2 p-3">
                {moreMenuItems.map((item) => (
                  <button
                    key={item.to}
                    onClick={() => { navigate(item.to); setShowMore(false); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${item.color} border border-white/[0.05] active:scale-95 transition-all duration-200 ${
                      location.pathname === item.to ? 'ring-1 ring-fifa-gold/30' : ''
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="px-3 pb-3 space-y-2">
                {isAuthenticated && user?.role === 'admin' && (
                  <button
                    onClick={() => { navigate('/admin'); setShowMore(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-fifa-gold/10 to-yellow-500/5 border border-fifa-gold/20 active:scale-[0.98] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-fifa-gold/20 flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-fifa-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-fifa-gold">Admin Panel</p>
                      <p className="text-[10px] text-gray-500">Manage everything</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                {!isAuthenticated && (
                  <button
                    onClick={() => { navigate('/login'); setShowMore(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600/15 to-primary-500/5 border border-primary-500/20 active:scale-[0.98] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-primary-400">Sign In</p>
                      <p className="text-[10px] text-gray-500">Login to your account</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
        <div className="h-px bg-gradient-to-r from-transparent via-fifa-gold/20 to-transparent" />
        <div className="h-16 bg-gradient-to-t from-fifa-darker via-fifa-darker/98 to-fifa-darker/95 backdrop-blur-xl">
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
                    {isActive && (
                      <span className="absolute -top-1.5 w-1.5 h-1.5 rounded-full bg-fifa-gold shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                    )}
                    <svg
                      className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                      fill={isActive ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={isActive ? 0 : 1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                    <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                      {tab.label}
                    </span>
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
              {showMore && (
                <span className="absolute -top-1.5 w-1.5 h-1.5 rounded-full bg-fifa-gold shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
              )}
              <svg className={`w-6 h-6 transition-transform duration-200 ${showMore ? 'scale-110 rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <span className={`text-[10px] leading-none ${showMore ? 'font-bold' : 'font-medium'}`}>
                More
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
