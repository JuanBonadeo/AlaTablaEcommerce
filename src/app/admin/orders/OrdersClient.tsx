'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Filter, Download, Package, Clock, CheckCircle, XCircle,
  DollarSign, TrendingUp, ShoppingBag, Users, Eye, MessageCircle, Store
} from 'lucide-react';
import { Order, OrderList, OrderStatus, ShipmentStatus } from '@/lib/types/order.types';
import { updateOrderStatusAction } from '@/lib/actions/order/order.actions';
import { updateShipmentStatusAction } from '@/lib/actions/shipping/shipping-actions';
import OrderDetailModal from './OrderDetailModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { formatPrice } from '@/lib/utils/pricing';

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
  const [pendingShipmentChange, setPendingShipmentChange] = useState<{ id: string; status: ShipmentStatus } | null>(null);
  const [isUpdatingShipment, setIsUpdatingShipment] = useState(false);

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

  const handleShipmentStatusChange = async (shipmentId: string, newStatus: ShipmentStatus) => {
    setConfirmMessage('¿Estás seguro de cambiar el estado del envío?');
    setPendingShipmentChange({ id: shipmentId, status: newStatus });
    setConfirmOpen(true);
  };

  const confirmShipmentStatusChange = async () => {
    if (!pendingShipmentChange) return;
    setIsUpdatingShipment(true);
    try {
      const result = await updateShipmentStatusAction(pendingShipmentChange.id, pendingShipmentChange.status);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error al actualizar el estado del envío');
    } finally {
      setIsUpdatingShipment(false);
      setConfirmOpen(false);
      setPendingShipmentChange(null);
    }
  };

  const handleWhatsAppContact = (order: Order) => {
    const phone = order.address?.phone || order.user?.email || '';
    // Limpiar el teléfono de caracteres no numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Hola ${order.user?.name || 'cliente'}, te contacto desde AlaTabla respecto a tu orden #${order.id.slice(0, 8)}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      PAID: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      SHIPPED: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      DELIVERED: 'bg-green-500/20 text-green-400 border-green-500/50',
      CANCELED: 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    const icons: Record<OrderStatus, React.ReactNode> = {
      PENDING: <Clock size={14} />,
      PAID: <DollarSign size={14} />,
      SHIPPED: <Package size={14} />,
      DELIVERED: <CheckCircle size={14} />,
      CANCELED: <XCircle size={14} />,
    };

    const labels: Record<OrderStatus, string> = {
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
      currencyFormat(order.total),
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Órdenes</h1>
            <p className="text-sm sm:text-base text-gray-400">{stats.total} órdenes en total</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">Exportar</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs">Total</span>
              <ShoppingBag className="text-gray-500" size={16} />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-[#171718] border border-yellow-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs">Pendientes</span>
              <Clock className="text-yellow-500" size={16} />
            </div>
            <p className="text-lg sm:text-xl font-bold text-yellow-400">{stats.pending}</p>
          </div>

          <div className="bg-[#171718] border border-blue-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs">Pagadas</span>
              <DollarSign className="text-blue-500" size={16} />
            </div>
            <p className="text-lg sm:text-xl font-bold text-blue-400">{stats.paid}</p>
          </div>

          <div className="bg-[#171718] border border-purple-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs">Enviadas</span>
              <Package className="text-purple-500" size={16} />
            </div>
            <p className="text-lg sm:text-xl font-bold text-purple-400">{stats.shipped}</p>
          </div>

          <div className="bg-[#171718] border border-green-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs">Entregadas</span>
              <CheckCircle className="text-green-500" size={16} />
            </div>
            <p className="text-lg sm:text-xl font-bold text-green-400">{stats.delivered}</p>
          </div>

          <div className="bg-[#171718] border border-orange-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs">Ingresos</span>
              <TrendingUp className="text-orange-500" size={16} />
            </div>
            <p className="text-lg sm:text-xl font-bold text-orange-400 truncate">{currencyFormat(stats.revenue)}</p>
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
                      <span className="text-green-400 font-medium">{formatPrice(order.total)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={isUpdating}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 cursor-pointer ${order.status === 'PENDING'
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
                            <div className={`w-2 h-2 rounded-full ${order.payment.status === 'COMPLETED' ? 'bg-green-500' :
                              order.payment.status === 'TRANSFERRED' ? 'bg-blue-500' :
                                order.payment.status === 'PENDING' ? 'bg-yellow-500' :
                                  'bg-red-500'
                              }`} />
                            <span className="text-gray-400 text-sm capitalize">
                              {order.payment.status === 'COMPLETED' ? 'Pagado' :
                                order.payment.status === 'TRANSFERRED' ? 'Transferido' :
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
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.shipment.status}
                              onChange={(e) => handleShipmentStatusChange(order.shipment!.id, e.target.value as ShipmentStatus)}
                              disabled={isUpdatingShipment}
                              className={`text-xs rounded px-2 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 cursor-pointer border ${
                                order.shipment.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                                order.shipment.status === 'SHIPPED' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                                order.shipment.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                                'bg-red-500/20 text-red-400 border-red-500/50'
                              }`}
                            >
                              <option value="PENDING">Pendiente</option>
                              <option value="SHIPPED">Enviado</option>
                              <option value="DELIVERED">Entregado</option>
                              <option value="RETURNED">Devuelto</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <span className={`px-2 py-0.5 rounded ${order.shipment.carrier === 'ENTREGA_LOCAL'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-blue-500/20 text-blue-400'
                              }`}>
                              {order.shipment.carrier === 'ENTREGA_LOCAL' ? '🏠 Local' : '📦 ' + order.shipment.carrier}
                            </span>
                          </div>
                          {order.shipment.tracking && (
                            <span className="text-gray-500 text-xs font-mono">
                              #{order.shipment.tracking.slice(0, 10)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Store size={14} className="text-orange-400" />
                          <span className="text-orange-400 text-sm font-medium">Retira por local</span>
                        </div>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleWhatsAppContact(order)}
                          className="text-green-500 hover:text-green-400 transition-colors"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>
                      </div>
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
        title={pendingShipmentChange ? "Cambiar estado del envío" : "Cambiar estado"}
        message={confirmMessage}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        loading={isUpdating || isUpdatingShipment}
        onConfirm={pendingShipmentChange ? confirmShipmentStatusChange : confirmStatusChange}
        onCancel={() => { 
          setConfirmOpen(false); 
          setPendingOrderChange(null);
          setPendingShipmentChange(null);
        }}
      />
    </>
  );
}
