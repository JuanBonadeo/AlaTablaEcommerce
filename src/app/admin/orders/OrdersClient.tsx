'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, Download, Package, Clock, CheckCircle, XCircle, 
  DollarSign, TrendingUp, ShoppingBag, Users, Eye 
} from 'lucide-react';
import { Order, OrderList, OrderStatus } from '@/lib/types/order.types';
import { updateOrderStatusAction } from '@/lib/actions/order/order.actions';
import OrderDetailModal from './OrderDetailModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface OrdersClientProps {
  initialOrders: OrderList;
  stats: {
    total: number;
    pending: number;
    paid: number;
    shipped: number;
    delivered: number;
    canceled: number;
    revenue: number;
  };
}

export default function OrdersClient({ initialOrders, stats }: OrdersClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [pendingOrderChange, setPendingOrderChange] = useState<{ id: string; status: OrderStatus } | null>(null);

  const filteredOrders = initialOrders.items.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setConfirmMessage('¿Estás seguro de cambiar el estado de esta orden?');
    setPendingOrderChange({ id: orderId, status: newStatus });
    setConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingOrderChange) return;
    setIsUpdating(true);
    try {
      const result = await updateOrderStatusAction(pendingOrderChange.id, pendingOrderChange.status);
      if (result.ok) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
      setConfirmOpen(false);
      setPendingOrderChange(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      PAID: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      SHIPPED: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      DELIVERED: 'bg-green-500/20 text-green-400 border-green-500/50',
      CANCELED: 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    const icons = {
      PENDING: <Clock size={14} />,
      PAID: <DollarSign size={14} />,
      SHIPPED: <Package size={14} />,
      DELIVERED: <CheckCircle size={14} />,
      CANCELED: <XCircle size={14} />,
    };

    const labels = {
      PENDING: 'Pendiente',
      PAID: 'Pagado',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELED: 'Cancelado',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha'];
    const rows = filteredOrders.map(order => [
      order.id,
      order.user?.name || '',
      order.user?.email || '',
      `$${order.total.toFixed(2)}`,
      order.status,
      new Date(order.createdAt).toLocaleDateString('es-ES')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordenes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Órdenes</h1>
          <p className="text-gray-400">{stats.total} órdenes en total</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Download size={18} />
          Exportar CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total</span>
            <ShoppingBag className="text-gray-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-[#171718] border border-yellow-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Pendientes</span>
            <Clock className="text-yellow-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>

        <div className="bg-[#171718] border border-blue-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Pagadas</span>
            <DollarSign className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.paid}</p>
        </div>

        <div className="bg-[#171718] border border-purple-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Enviadas</span>
            <Package className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-purple-400">{stats.shipped}</p>
        </div>

        <div className="bg-[#171718] border border-green-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Entregadas</span>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
        </div>

        <div className="bg-[#171718] border border-orange-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Ingresos</span>
            <TrendingUp className="text-orange-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-orange-400">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
            >
              <option value="ALL">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="PAID">Pagadas</option>
              <option value="SHIPPED">Enviadas</option>
              <option value="DELIVERED">Entregadas</option>
              <option value="CANCELED">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-[#0a0a0a]">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Cliente</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Productos</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Estado</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pago</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Envío</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-gray-400 text-sm font-mono">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{order.user?.name}</p>
                      <p className="text-gray-500 text-sm">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">{order.items?.length || 0} items</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-green-400 font-medium">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      disabled={isUpdating}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 cursor-pointer ${
                        order.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                          : order.status === 'PAID'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          : order.status === 'SHIPPED'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                          : order.status === 'DELIVERED'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="PAID">Pagado</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELED">Cancelado</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    {order.payment ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            order.payment.status === 'COMPLETED' ? 'bg-green-500' :
                            order.payment.status === 'PENDING' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <span className="text-gray-400 text-sm capitalize">
                            {order.payment.status === 'COMPLETED' ? 'Pagado' :
                             order.payment.status === 'PENDING' ? 'Pendiente' :
                             'Fallido'}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">{order.payment.provider}</span>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-sm">Sin pago</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {order.shipment ? (
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          order.shipment.status === 'DELIVERED' ? 'bg-green-500' :
                          order.shipment.status === 'IN_TRANSIT' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-gray-400 text-sm capitalize">{order.shipment.status.toLowerCase()}</span>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-sm">Sin envío</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No se encontraron órdenes</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
    <ConfirmModal
      open={confirmOpen}
      title="Cambiar estado"
      message={confirmMessage}
      confirmLabel="Confirmar"
      cancelLabel="Cancelar"
      loading={isUpdating}
      onConfirm={confirmStatusChange}
      onCancel={() => { setConfirmOpen(false); setPendingOrderChange(null); }}
    />
    </>
  );
}
