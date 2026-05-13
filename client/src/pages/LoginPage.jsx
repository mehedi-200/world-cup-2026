import { Navigate, Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-fifa-dark">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-fifa-maroon/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-fifa-blue/10 rounded-full blur-3xl" />

      <div className="relative flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-fifa-gold to-yellow-600 items-center justify-center mb-4 shadow-lg shadow-fifa-gold/20">
              <svg className="w-8 h-8 text-fifa-dark" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3l2.5 2.5L12 10l-2.5-2.5L12 5zm-5 5l2.5-2.5L12 10l-2.5 2.5L7 10zm0 4l2.5-2.5L12 14l-2.5 2.5L7 14zm5 5l-2.5-2.5L12 14l2.5 2.5L12 19zm5-5l-2.5 2.5L12 14l2.5-2.5L17 14zm0-4l-2.5 2.5L12 10l2.5-2.5L17 10z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to World Cup 2026</p>
          </div>

          <LoginForm />

          <p className="text-center text-gray-500 text-xs mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-fifa-gold hover:text-yellow-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
