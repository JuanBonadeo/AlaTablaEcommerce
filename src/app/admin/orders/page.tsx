import { getAllOrdersAction, getOrderStatsAction } from '@/lib/actions/order/order.actions';
import OrdersClient from './OrdersClient';

export default async function OrdersPage() {
  const [ordersData, stats] = await Promise.all([
    getAllOrdersAction({ limit: 50 }),
    getOrderStatsAction()
  ]);

  return <OrdersClient initialOrders={ordersData || { items: [], pagination: { totalPages: 0, currentPage: 1, limit: 50, total: 0 } }} stats={stats} />;
}

