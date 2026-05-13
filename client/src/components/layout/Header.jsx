import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/matches', label: 'Matches' },
  { to: '/groups', label: 'Groups' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/quizzes', label: 'Quiz' },
  { to: '/polls', label: 'Polls' },
  { to: '/human-calculator', label: '🧮 Calculator' },
];

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  const linkClasses = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-fifa-gold'
        : 'text-gray-400 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-fifa-darker/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fifa-gold to-yellow-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-fifa-dark" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3l2.5 2.5L12 10l-2.5-2.5L12 5zm-5 5l2.5-2.5L12 10l-2.5 2.5L7 10zm0 4l2.5-2.5L12 14l-2.5 2.5L7 14zm5 5l-2.5-2.5L12 14l2.5 2.5L12 19zm5-5l-2.5 2.5L12 14l2.5-2.5L17 14zm0-4l-2.5 2.5L12 10l2.5-2.5L17 10z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">WC <span className="text-fifa-gold">2026</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === '/'}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-fifa-gold rounded-full" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.is_admin === 1 && (
                  <Link to="/admin" className="text-xs font-semibold text-fifa-gold bg-fifa-gold/10 hover:bg-fifa-gold/20 px-3 py-1.5 rounded-lg transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fifa-maroon to-fifa-blue border-2 border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                </Link>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">Login</Link>
                <Link to="/register" className="text-sm font-medium rounded-lg bg-gradient-to-r from-fifa-gold to-yellow-500 text-fifa-dark px-4 py-2 hover:shadow-lg hover:shadow-fifa-gold/20 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.is_admin === 1 && (
                  <Link to="/admin" className="text-[10px] font-bold text-fifa-gold bg-fifa-gold/10 px-2 py-1 rounded-md">
                    ADMIN
                  </Link>
                )}
                <Link to="/profile">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fifa-maroon to-fifa-blue border-2 border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium rounded-lg bg-gradient-to-r from-fifa-gold to-yellow-500 text-fifa-dark px-3 py-1.5">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
