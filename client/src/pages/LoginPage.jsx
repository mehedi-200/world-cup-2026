import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your World Cup account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
