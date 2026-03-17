'use client';

import { Menu, Home, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#0f171d]/85 px-3 py-3 backdrop-blur sm:px-4 sm:py-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
            title="Ir a la tienda"
          >
            <Home size={20} />
            <span className="hidden sm:inline text-sm font-medium">Volver a la tienda</span>
          </Link>

          <div className="hidden md:block">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Panel Admin</p>
            <p className="text-sm font-medium text-slate-200 capitalize">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
          >
            <Plus size={14} />
            Nuevo producto
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-xs font-semibold text-white shadow-[0_12px_20px_-16px_rgba(251,146,60,0.95)] transition-transform hover:scale-[1.02]"
          >
            <ShoppingBag size={14} />
            Órdenes
          </Link>
        </div>
      </div>
    </header>
  );
}
