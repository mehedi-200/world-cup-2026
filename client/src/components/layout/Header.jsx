import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/matches', label: 'Matches' },
  { to: '/groups', label: 'Groups' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/quizzes', label: 'Quiz' },
  { to: '/polls', label: 'Polls' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-fifa-gold border-b-2 border-fifa-gold'
        : 'text-gray-300 hover:text-white'
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-fifa-gold bg-white/10'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-fifa-darker/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-gradient">WC 2026</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fifa-maroon/60 border border-white/20 flex items-center justify-center text-sm font-semibold text-white uppercase">
                  {user?.username?.charAt(0) || 'U'}
                </div>
                <span className="text-sm text-gray-300">{user?.username}</span>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className="text-sm text-fifa-gold hover:text-yellow-300 font-medium transition-colors">
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-fifa-maroon hover:bg-fifa-maroon/80 text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-fifa-darker/95 backdrop-blur-lg">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={mobileLinkClasses}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-4 py-3 border-t border-white/10">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-fifa-maroon/60 border border-white/20 flex items-center justify-center text-sm font-semibold text-white uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm text-gray-300">{user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 text-sm font-medium rounded-lg bg-fifa-maroon hover:bg-fifa-maroon/80 text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
