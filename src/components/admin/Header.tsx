'use client';

import { Menu, Home } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-[#171718] border-b border-gray-800 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            title="Ir a la tienda"
          >
            <Home size={20} />
            <span className="hidden sm:inline text-sm font-medium">Volver a la tienda</span>
          </Link>
        </div>

        <div className="text-right">
          <p className="text-xs sm:text-sm font-medium text-white">Panel Admin</p>
        </div>
      </div>
    </header>
  );
}
