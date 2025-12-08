import { getAllOrdersAction, getOrderStatsAction } from '@/lib/actions/order/order.actions';
import OrdersClient from './OrdersClient';

export default async function OrdersPage() {
  const [ordersData, stats] = await Promise.all([
    getAllOrdersAction({ limit: 50 }),
    getOrderStatsAction()
  ]);

  return <OrdersClient initialOrders={ordersData} stats={stats} />;
}

