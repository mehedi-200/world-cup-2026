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
];

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide header on admin pages (admin has its own layout)
  if (location.pathname.startsWith('/admin')) return null;

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-fifa-gold border-b-2 border-fifa-gold'
        : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-fifa-darker/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
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

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-fifa-maroon/60 border border-white/20 flex items-center justify-center text-sm font-semibold text-white uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm text-gray-300">{user?.username}</span>
                </Link>
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
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-fifa-maroon hover:bg-fifa-maroon/80 text-white transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-xs text-fifa-gold font-semibold bg-fifa-gold/10 px-2 py-1 rounded-md">
                    Admin
                  </Link>
                )}
                <Link to="/profile">
                  <div className="w-8 h-8 rounded-full bg-fifa-maroon/60 border border-white/20 flex items-center justify-center text-sm font-semibold text-white uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-fifa-maroon hover:bg-fifa-maroon/80 text-white transition-colors"
              >
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
