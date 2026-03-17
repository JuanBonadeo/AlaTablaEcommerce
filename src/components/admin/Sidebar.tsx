'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', section: 'General' },
  { icon: Package, label: 'Productos', href: '/admin/products', section: 'Operaciones' },
  { icon: ShoppingCart, label: 'Órdenes', href: '/admin/orders', section: 'Operaciones' },
  { icon: Users, label: 'Usuarios', href: '/admin/users', section: 'Operaciones' },
  { icon: Tag, label: 'Categorías', href: '/admin/categories', section: 'Catálogo' },
  { icon: Tag, label: 'Ofertas', href: '/admin/offers', section: 'Catálogo' },
  { icon: BarChart3, label: 'Reportes', href: '/admin/reports', section: 'Gestión' },
  { icon: Settings, label: 'Configuración', href: '/admin/settings', section: 'Gestión' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const sections = ['General', 'Operaciones', 'Catálogo', 'Gestión'];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 min-h-screen bg-[#0d1419]/95 backdrop-blur border-r border-slate-800/80 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
      <div className="p-6 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-300">
          Admin Console
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-100">AlaTabla</h1>
        <p className="text-sm text-slate-400 mt-1">Panel de Administración</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Estado</p>
            <p className="mt-1 text-sm font-semibold text-emerald-400">Online</p>
          </div>
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Perfil</p>
            <p className="mt-1 text-sm font-semibold text-sky-300">Admin</p>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section} className="mb-5 last:mb-0">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{section}</p>
            <ul className="space-y-1.5">
              {menuItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_10px_24px_-14px_rgba(251,146,60,0.85)]'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        {isActive && <span className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white/90" />}
                        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/80">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all w-full">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
    </>
  );
}
