import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const sidebarWidth = sidebarCollapsed ? 80 : 260;

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [sidebarWidth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/95 to-slate-100/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <Sidebar />
      <main className="main-content min-h-screen w-full transition-[margin] duration-300 ease-in-out flex flex-col">
        <Navbar notificationCount={3} />
        <div className="flex-1 p-4 sm:p-5 lg:p-6 min-w-0 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
