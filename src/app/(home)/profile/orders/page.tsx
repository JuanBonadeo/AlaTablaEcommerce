import { Title } from '@/components/ui/Title';
import OrdersClient from './ui/OrdersClient';
import { requireAuth } from '@/lib/auth/require-auth';

export default async function OrdersPage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ">
        <Title title="Mis Órdenes" size="3xl" className="mb-6" />
        <OrdersClient userId={session.user.id} />
      </div>
    </div>
  );
}