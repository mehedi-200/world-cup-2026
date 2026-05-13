import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const primaryTabs = [
  { to: '/admin', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/admin/matches', label: 'Matches', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/admin/quizzes', label: 'Quizzes', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { to: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
];

const moreItems = [
  { to: '/admin/teams', label: 'Teams', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9', bg: 'bg-[#007AFF]' },
  { to: '/admin/groups', label: 'Groups', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', bg: 'bg-[#AF52DE]' },
  { to: '/admin/polls', label: 'Polls', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', bg: 'bg-[#34C759]' },
  { to: '/admin/predictions', label: 'Scores', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', bg: 'bg-[#FF9500]' },
  { to: '/', label: 'Back', icon: 'M10 19l-7-7m0 0l7-7m-7 7h18', bg: 'bg-[#8E8E93]' },
];

export default function AdminBottomNav() {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => { navigate(path); setShowMore(false); };

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowMore(false)}>
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
                  {moreItems.map((item) => (
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

      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-bottom">
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
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-[10px]" style={{ fontWeight: showMore ? 600 : 400 }}>More</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
