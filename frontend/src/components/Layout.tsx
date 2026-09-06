import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { OfflineBanner } from './OfflineBanner';

export function Layout() {
  return (
    <div className="paypal-page">
      <Sidebar />
      <main className="content">
        <OfflineBanner />
        <Outlet />
      </main>
    </div>
  );
}
