import { Title } from '@/components/ui/Title';
import OrdersClient from './ui/OrdersClient';
import { requireAuth } from '@/lib/auth/require-auth';
import { Package } from 'lucide-react';

export default async function OrdersPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/50">
            <Package size={28} />
          </div>
          <Title title="Mis Órdenes" size="3xl" className="mb-0" />
        </div>

        <OrdersClient userId={session.user.id} />
      </div>
    </div>
  );
}