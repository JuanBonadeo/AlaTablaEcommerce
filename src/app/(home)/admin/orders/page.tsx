import { getAllOrdersAction } from '@/lib/actions/order/order.actions';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrdersFilters } from '@/components/admin/OrdersFilters';
import { OrderStatus } from '@/lib/types/order.types';
import { requireAdmin } from '@/lib/auth/require-admin';

interface SearchParams {
  status?: OrderStatus;
  page?: string;
}

interface AdminOrdersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  await requireAdmin();
  
  const params = await searchParams;
  const status = params.status as OrderStatus | undefined;
  const page = Number(params.page) || 1;

  const result = await getAllOrdersAction({ 
    limit: 50,
    page,
    status
  });
  
  const orders = result.success ? result.data?.items || [] : [];
  const pagination = result.success ? result.data?.pagination : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Administrar Órdenes</h1>
        <div className="text-sm text-gray-500">
          {pagination?.total || 0} {pagination?.total === 1 ? 'orden' : 'órdenes'}
        </div>
      </div>

      <OrdersFilters currentStatus={status} />

      {orders.length > 0 ? (
        <OrdersTable orders={orders} />
      ) : (
        <div className="bg rounded-lg p-12 text-center">
          <p className="text-gray-300 mb-4">
            {status ? `No hay órdenes con estado "${status}"` : 'No hay órdenes registradas'}
          </p>
          {!result.success && (
            <p className="text-red-500 text-sm mt-2">Error: {result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
