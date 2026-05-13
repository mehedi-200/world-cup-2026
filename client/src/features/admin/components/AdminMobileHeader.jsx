import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AdminMobileHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 h-14 bg-fifa-darker/90 backdrop-blur-lg border-b border-white/10 z-30 lg:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <h1 className="text-lg font-bold text-gradient">WC Admin</h1>
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
          {user?.username?.[0]?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
