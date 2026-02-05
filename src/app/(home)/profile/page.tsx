
import { LogoutBtn } from "@/components/auth/LogoutBtn";
import Link from "next/link";
import { Title } from "@/components/ui/Title";
import { requireAuth } from "@/lib/auth/require-auth";
import { User, Mail, Shield, Package, MapPin, Lock, Settings } from "lucide-react";

export default async function ProfilePage() {
  const session = await requireAuth();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-orange-400/10 rounded-full">
            <User className="text-orange-400" size={32} />
          </div>
          <Title title="Mi Perfil" size="3xl" className="mb-0" />
        </div>

        <div className="bg-[#171718] rounded-xl shadow-lg p-8 mb-8 border border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <Settings size={20} className="text-gray-400" />
            Información Personal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-gray-500 text-sm flex items-center gap-2"><User size={14} /> Nombre</p>
              <p className="text-white font-medium">{session?.user?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-sm flex items-center gap-2"><Mail size={14} /> Email</p>
              <p className="text-white font-medium">{session?.user?.email}</p>
            </div>
            {isAdmin && (
              <>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm flex items-center gap-2"><Shield size={14} /> Rol</p>
                  <p className="text-white font-medium capitalize">{(session?.user as any)?.role?.toLowerCase() || 'Usuario'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">Estado</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20">
                    Administrador
                  </span>
                </div>
              </>

            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/profile/orders" className="group block p-6 bg-[#171718] rounded-xl border border-gray-800 hover:border-orange-500/50 hover:bg-[#1a1a1c] transition-all">
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg w-fit group-hover:bg-orange-400/10 transition-colors">
              <Package className="text-white group-hover:text-orange-400 transition-colors" size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mis Órdenes</h3>
            <p className="text-gray-400 text-sm">Ver historial de compras y estado de envíos</p>
          </Link>

          <Link href="/profile/addresses" className="group block p-6 bg-[#171718] rounded-xl border border-gray-800 hover:border-orange-500/50 hover:bg-[#1a1a1c] transition-all">
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg w-fit group-hover:bg-orange-400/10 transition-colors">
              <MapPin className="text-white group-hover:text-orange-400 transition-colors" size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Direcciones</h3>
            <p className="text-gray-400 text-sm">Gestionar direcciones de envío</p>
          </Link>

          <Link href="/profile/change-password" className="group block p-6 bg-[#171718] rounded-xl border border-gray-800 hover:border-orange-500/50 hover:bg-[#1a1a1c] transition-all">
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg w-fit group-hover:bg-orange-400/10 transition-colors">
              <Lock className="text-white group-hover:text-orange-400 transition-colors" size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Seguridad</h3>
            <p className="text-gray-400 text-sm">Cambiar tu contraseña</p>
          </Link>

          {isAdmin && (
            <Link href="/admin" className="md:col-span-3 group block p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-orange-400/20 transition-colors">
                  <Settings className="text-gray-300 group-hover:text-orange-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Panel de Administración</h3>
                  <p className="text-gray-400 text-sm">Gestionar productos, categorías y órdenes</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="flex justify-center">
          <LogoutBtn />
        </div>
      </div>
    </div>
  );
}