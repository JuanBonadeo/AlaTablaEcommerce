'use client'

import { useEffect, useState, useCallback } from 'react';
import { getOrdersByUserIdAction, cancelOrderAction } from '@/lib/actions/order/order.actions';
import { Order } from '@/lib/types/order.types';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import Link from 'next/link';
import Image from 'next/image';
import { AlertOctagon, Calendar, CheckCircle2, ChevronRight, Clock, MapPin, Package, Smartphone, Truck, XCircle, CreditCard, Wallet } from 'lucide-react';

interface OrdersClientProps {
  userId: string;
}

const OrdersClient = ({ userId }: OrdersClientProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getOrdersByUserIdAction(userId);

      if (!result.success) {
        setError(result.message || 'Error al cargar las órdenes');
        return;
      }

      setOrders(result.data || []);
    } catch (err) {
      setError('Error al cargar las órdenes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadOrders();
    }
  }, [userId, loadOrders]);

  const handleCancelOrder = async (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      setCancelingOrderId(orderToCancel);
      setShowCancelModal(false);
      const result = await cancelOrderAction(orderToCancel);

      if (!result.ok) {
        return;
      }

      await loadOrders();
    } catch (err) {
      console.error('Error canceling order:', err);
    } finally {
      setCancelingOrderId(null);
      setOrderToCancel(null);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          {/* Custom Spinner */}
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center bg-[#171718] p-8 rounded-xl border border-gray-800">
          <AlertOctagon size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-6">{error}</p>
          <Link href="/profile" className="btn-primary inline-flex items-center gap-2">
            Volver al perfil
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-[#171718] rounded-xl border border-gray-800 p-8">
        <div className="text-center max-w-md">
          <div className="mb-6 bg-gray-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <Package size={48} className="text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No tienes órdenes</h3>
          <p className="text-gray-400 mb-8">Aún no has realizado ninguna compra. ¡Explora nuestros productos y haz tu primer pedido!</p>
          <Link href="/productos" className="btn-primary inline-flex items-center gap-2">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'PAID': 'bg-green-500/10 text-green-500 border-green-500/20',
      'SHIPPED': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'DELIVERED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'CANCELED': 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ElementType> = {
      'PENDING': Clock,
      'PAID': CheckCircle2,
      'SHIPPED': Truck,
      'DELIVERED': Package,
      'CANCELED': XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon size={14} className="mr-1.5" />;
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PAID': 'Pagado',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELED': 'Cancelado',
    };
    return texts[status] || status;
  };

  const getPaymentStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-500/10 text-gray-400';
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-500/10 text-yellow-500',
      'PAID': 'bg-green-500/10 text-green-500',
      'TRANSFERRED': 'bg-blue-500/10 text-blue-500',
      'COMPLETED': 'bg-green-500/10 text-green-500',
      'FAILED': 'bg-red-500/10 text-red-500',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400';
  };

  const getPaymentStatusText = (status?: string) => {
    if (!status) return 'Sin pago';
    const texts: Record<string, string> = {
      'PENDING': 'Pago pendiente',
      'PAID': 'Pago recibido',
      'TRANSFERRED': 'Transferido (Verificando)',
      'COMPLETED': 'Pago confirmado',
      'FAILED': 'Pago fallido',
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed -inset-10  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#171718] border border-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertOctagon size={24} />
              <h3 className="text-xl font-bold text-white">Cancelar orden</h3>
            </div>
            <p className="text-gray-400 mb-6">
              ¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer y el stock será restaurado.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 border border-gray-700 bg-transparent text-gray-300 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer font-medium"
              >
                No, volver
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium shadow-lg shadow-red-900/20"
              >
                Sí, cancelar orden
              </button>
            </div>
          </div>
        </div>
      )}

      {orders.map((order) => {
        const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        return (
          <div key={order.id} className="bg-[#171718] rounded-xl shadow-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-all">
            {/* Order Header */}
            <div className="bg-[#1f1f21] px-6 py-4 border-b border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg text-gray-400 mt-1">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      Orden #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                  {order.payment && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getPaymentStatusColor(order.payment.status)}`}>
                      {getPaymentStatusText(order.payment.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-6">
              <div className="space-y-4 mb-6">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                      {item.product?.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="font-medium text-sm text-gray-200 truncate pr-4">{item.product?.name}</h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">Variante: {item.variant.name}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">x{item.quantity}</span>
                        <span className="text-sm font-medium text-white">{currencyFormat(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <p className="text-xs text-gray-500 text-center py-1 bg-gray-800/20 rounded">
                    +{(order.items?.length || 0) - 3} producto(s) más
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-800 pt-5 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shipping Info */}
                  {(order.address || order.shipment) && (
                    <div className="text-sm bg-[#1a1a1c] p-4 rounded-xl border border-gray-800">
                      <p className="font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <MapPin size={14} className="text-orange-400" /> Envío
                      </p>
                      {order.shipment && (
                        <div className="mb-2 pb-2 border-b border-gray-700/50">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-500 text-xs">Servicio</span>
                            <span className="text-gray-300 font-medium">{order.shipment.serviceName || order.shipment.service}</span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-500 text-xs">Costo</span>
                            <span className="text-orange-400 font-medium">{currencyFormat(order.shipment.cost ?? 0)}</span>
                          </div>
                          {order.shipment.estimatedDays && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 text-xs">Tiempo</span>
                              <span className="text-gray-400 text-xs">{order.shipment.estimatedDays} días aprox.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {order.address && (
                        <div className="space-y-0.5">
                          <p className="text-gray-300 font-medium">{order.address.firstName} {order.address.lastName}</p>
                          <p className="text-xs text-gray-500">{order.address.street} - {order.address.city}, {order.address.state}</p>
                          <p className="text-xs text-gray-500">{order.address.zip} - {order.address.phone}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total Summary */}
                  <div className="text-sm bg-[#1a1a1c] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <Wallet size={14} className="text-orange-400" /> Resumen
                      </p>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Artículos ({itemsCount})</span>
                        <span className="text-gray-300">{currencyFormat(order.total - (order.shipment?.cost || 0))}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Envío</span>
                        <span className="text-gray-300">{order.shipment ? currencyFormat(order.shipment.cost ?? 0) : '$0'}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 pt-3 mt-1 flex justify-between items-end">
                      <span className="text-gray-400 font-medium">Total</span>
                      <span className="text-xl font-bold text-white">{currencyFormat(order.total)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-[#1f1f21] px-6 py-4 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row gap-3 justify-end text-sm">

                {(order.status === 'PENDING' || order.status === 'PAID') && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancelingOrderId === order.id}
                    className="flex-1 sm:flex-none text-center bg-gray-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {cancelingOrderId === order.id ? 'Cancelando...' : 'Cancelar orden'}
                  </button>
                )}

                {order.status === 'PENDING' && !order.payment && (
                  <Link
                    href={`/order/${order.id}/payment`}
                    className="flex-1 sm:flex-none text-center bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-4 py-2.5 rounded-lg transition-all font-medium inline-flex items-center justify-center gap-2"
                  >
                    <CreditCard size={16} /> Completar pago
                  </Link>
                )}

                <Link
                  href={`/order/${order.id}/payment`}
                  className="flex-1 sm:flex-none text-center btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5"
                >
                  <ChevronRight size={16} /> Ver detalles
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersClient;