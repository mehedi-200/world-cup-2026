import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminBottomNav from './AdminBottomNav';
import AdminMobileHeader from './AdminMobileHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-fifa-dark">
      <AdminSidebar />
      <AdminMobileHeader />

      <div className="lg:ml-64">
        <main className="px-4 pt-4 pb-20 lg:px-8 lg:pt-8 lg:pb-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}
