import { Title } from '@/components/ui/Title';
import OrdersClient from './ui/OrdersClient';
import { requireAuth } from '@/lib/auth/require-auth';
import { Package } from 'lucide-react';

export default async function OrdersPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto ">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-orange-400/10 rounded-full">
            <Package className="text-orange-400" size={32} />
          </div>
          <Title title="Mis Órdenes" size="3xl" className="mb-0" />
        </div>

        <OrdersClient userId={session.user.id} />
      </div>
    </div>
  );
}