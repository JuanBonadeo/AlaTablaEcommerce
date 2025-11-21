import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Title } from '@/components/ui/Title';
import OrdersClient from './ui/OrdersClient';

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ">
        <Title title="Mis Órdenes" size="3xl" className="mb-6" />
        <OrdersClient userId={session.user.id} />
      </div>
    </div>
  );
}