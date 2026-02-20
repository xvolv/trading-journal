import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Sidebar (desktop only) */}
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="md:ml-[var(--sidebar-width)] transition-all duration-300">
        <TopBar />
        <main className="p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
