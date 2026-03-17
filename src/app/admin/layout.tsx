'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-[#0b1115] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.2),_transparent_55%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.14),_transparent_50%)]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
