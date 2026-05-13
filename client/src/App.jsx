import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { SocketProvider } from '@/context/SocketContext';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
            <div className="min-h-screen flex flex-col bg-fifa-dark">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">
                <AppRoutes />
              </main>
              <div className="hidden md:block">
                <Footer />
              </div>
              <MobileBottomNav />
            </div>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
