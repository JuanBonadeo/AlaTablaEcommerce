import { LogoutBtn } from "@/components/auth/LogoutBtn";
import Link from "next/link";
import { Title } from "@/components/ui/Title";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function ProfilePage() {
    const session = await requireAuth();
    const isAdmin = (session?.user as any)?.role === 'ADMIN';
    
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title title="Mi Perfil" size="3xl" className="mb-8" />
        
        <div className="bg rounded-xl shadow-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <div className="space-y-2">
            <p className="text-gray-700"><span className="font-medium">Nombre:</span> {session?.user?.name}</p>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {session?.user?.email}</p>
            <p className="text-gray-700"><span className="font-medium">Rol:</span> {(session?.user as any)?.role || 'No definido'}</p>
            {isAdmin && (
              <p className="text-gray-700"><span className="font-medium">Estado:</span> <span className="text-blue-600 font-semibold">Administrador</span></p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/profile/orders" className="block p-6 bg rounded-xl shadow-lg border border-gray-700 hover:border-primary hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-2">Mis Órdenes</h3>
            <p className="text-gray-600 text-sm">Ver historial de compras y estado de envíos</p>
          </Link>
          
          <Link href="/profile/addresses" className="block p-6 bg rounded-xl shadow-lg border border-gray-700 hover:border-primary hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-2">Direcciones</h3>
            <p className="text-gray-600 text-sm">Gestionar direcciones de envío</p>
          </Link>

          {isAdmin && (
            <Link href="/admin" className="block p-6 bg-blue-50 rounded-xl shadow-lg border border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold mb-2 text-blue-900">Panel de Administración</h3>
              <p className="text-blue-700 text-sm">Gestionar productos, categorías y órdenes</p>
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