import { Navigate, Link } from 'react-router-dom';
import { RegisterForm } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-fifa-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(15,52,96,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-fifa-gold/5 rounded-full blur-3xl" />

      <div className="relative flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-fifa-maroon to-fifa-blue items-center justify-center mb-4 shadow-lg shadow-fifa-maroon/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Join the Game</h1>
            <p className="text-gray-500 text-sm mt-1">Create your World Cup 2026 account</p>
          </div>

          <RegisterForm />

          <p className="text-center text-gray-500 text-xs mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-fifa-gold hover:text-yellow-300 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
