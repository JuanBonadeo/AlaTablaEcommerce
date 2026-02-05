
import { LogoutBtn } from "@/components/auth/LogoutBtn";
import Link from "next/link";
import { Title } from "@/components/ui/Title";
import { requireAuth } from "@/lib/auth/require-auth";
import { User, Mail, Shield, Package, MapPin, Lock, Settings } from "lucide-react";

export default async function ProfilePage() {
  const session = await requireAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/50">
            <User size={28} />
          </div>
          <Title title="Mi Perfil" size="3xl" className="mb-0" />
        </div>

        {/* Personal Info Card */}
        <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-gray-800/50 hover:border-orange-500/20 transition-all duration-300">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white flex items-center gap-2">
            <Settings size={18} className="text-orange-400" />
            Información Personal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5 bg-[#1a1a1c] p-3 sm:p-4 rounded-xl border border-gray-800/50">
              <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
                <User size={14} /> Nombre
              </p>
              <p className="text-white font-medium text-sm sm:text-base">{session?.user?.name}</p>
            </div>
            <div className="space-y-1.5 bg-[#1a1a1c] p-3 sm:p-4 rounded-xl border border-gray-800/50">
              <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
                <Mail size={14} /> Email
              </p>
              <p className="text-white font-medium text-sm sm:text-base break-all">{session?.user?.email}</p>
            </div>
            {isAdmin && (
              <>
                <div className="space-y-1.5 bg-[#1a1a1c] p-3 sm:p-4 rounded-xl border border-gray-800/50">
                  <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
                    <Shield size={14} /> Rol
                  </p>
                  <p className="text-white font-medium text-sm sm:text-base capitalize">{userRole?.toLowerCase() || 'Usuario'}</p>
                </div>
                <div className="space-y-1.5 bg-[#1a1a1c] p-3 sm:p-4 rounded-xl border border-gray-800/50">
                  <p className="text-gray-500 text-xs sm:text-sm">Estado</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-500/20">
                    Administrador
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link 
            href="/profile/orders" 
            className="group block p-4 sm:p-6 bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl border-2 border-gray-800/50 hover:border-orange-500/30 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-[#1a1a1c] rounded-xl w-fit group-hover:bg-orange-400/10 transition-all duration-300 border border-gray-800/50 group-hover:border-orange-500/30">
              <Package className="text-white group-hover:text-orange-400 transition-colors" size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Mis Órdenes</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Ver historial de compras y estado de envíos</p>
          </Link>

          <Link 
            href="/profile/addresses" 
            className="group block p-4 sm:p-6 bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl border-2 border-gray-800/50 hover:border-orange-500/30 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-[#1a1a1c] rounded-xl w-fit group-hover:bg-orange-400/10 transition-all duration-300 border border-gray-800/50 group-hover:border-orange-500/30">
              <MapPin className="text-white group-hover:text-orange-400 transition-colors" size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Direcciones</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Gestionar direcciones de envío</p>
          </Link>

          <Link 
            href="/profile/change-password" 
            className="group block p-4 sm:p-6 bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl border-2 border-gray-800/50 hover:border-orange-500/30 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-[#1a1a1c] rounded-xl w-fit group-hover:bg-orange-400/10 transition-all duration-300 border border-gray-800/50 group-hover:border-orange-500/30">
              <Lock className="text-white group-hover:text-orange-400 transition-colors" size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Seguridad</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Cambiar tu contraseña</p>
          </Link>

          {isAdmin && (
            <Link 
              href="/admin" 
              className="sm:col-span-2 lg:col-span-3 group block p-4 sm:p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/5 rounded-2xl border-2 border-orange-500/30 hover:border-orange-500 ring-2 ring-orange-500/20 hover:scale-[1.01] transition-all duration-300 shadow-xl shadow-orange-500/10"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white shadow-lg shadow-orange-500/50">
                  <Settings size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Panel de Administración</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Gestionar productos, categorías y órdenes</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <LogoutBtn />
        </div>
      </div>
    </div>
  );
}