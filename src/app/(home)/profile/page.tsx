import { LogoutBtn } from "@/components/auth/LogoutBtn";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Title } from "@/components/ui/Title";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title title="Mi Perfil" size="3xl" className="mb-8" />
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <div className="space-y-2">
            <p className="text-gray-700"><span className="font-medium">Nombre:</span> {session?.user?.name}</p>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {session?.user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/profile/orders" className="block p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-primary hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-2">Mis Órdenes</h3>
            <p className="text-gray-600 text-sm">Ver historial de compras y estado de envíos</p>
          </Link>
          
          <Link href="/profile/addresses" className="block p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-primary hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-2">Direcciones</h3>
            <p className="text-gray-600 text-sm">Gestionar direcciones de envío</p>
          </Link>
        </div>

        <div className="flex justify-center">
          <LogoutBtn />
        </div>
      </div>
    </div>
  );
}