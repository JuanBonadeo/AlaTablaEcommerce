'use client'

import { useEffect, useState, useCallback } from 'react';
import { getOrdersByUserIdAction, cancelOrderAction } from '@/lib/actions/order/order.actions';
import { Order } from '@/lib/types/order.types';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import Link from 'next/link';
import Image from 'next/image';

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

      if (!result.success) {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/profile" className="btn-primary">
            Volver al perfil
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold mb-2">No tienes órdenes</h3>
          <p className="text-gray-600 mb-6">Aún no has realizado ninguna compra. ¡Explora nuestros productos y haz tu primer pedido!</p>
          <Link href="/productos" className="btn-primary">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PAID': 'bg-green-100 text-green-800 border-green-200',
      'SHIPPED': 'bg-blue-100 text-blue-800 border-blue-200',
      'DELIVERED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'CANCELED': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

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
    if (!status) return 'bg-gray-100 text-gray-700';
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-50 text-yellow-700',
      'PAID': 'bg-green-50 text-green-700',
      'TRANSFERRED': 'bg-blue-50 text-blue-700',
      'COMPLETED': 'bg-green-50 text-green-700',
      'FAILED': 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusText = (status?: string) => {
    if (!status) return 'Sin pago';
    const texts: Record<string, string> = {
      'PENDING': 'Pago pendiente',
      'PAID': 'Pago recibido',
      'TRANSFERRED': 'Transferido - En verificación',
      'COMPLETED': 'Pago confirmado',
      'FAILED': 'Pago fallido',
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed -inset-10  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Cancelar orden</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer y el stock será restaurado.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                No, volver
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
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
          <div key={order.id} className="bg rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            {/* Order Header */}
            <div className="bg px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">Orden #{order.id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  {order.payment && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                      {getPaymentStatusText(order.payment.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <div className="space-y-3 mb-4">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product?.name}</h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500">Variante: {item.variant.name}</p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">Cant: {item.quantity}</span>
                        <span className="text-sm font-medium">{currencyFormat(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{(order.items?.length || 0) - 3} producto(s) más
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{itemsCount} {itemsCount === 1 ? 'artículo' : 'artículos'}</span>
                  <span className="font-semibold text-lg text-primary">{currencyFormat(order.total)}</span>
                </div>
                
                {order.address && (
                  <div className="text-sm text-gray-600 bg p-3 rounded-lg">
                    <p className="font-medium text-gray-700 mb-1">Envío a:</p>
                    <p>{order.address.street}, {order.address.city}, {order.address.state}</p>
                  </div>
                )}

                {/* Shipping Information */}
                {order.shipment && (
                  <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-900 mb-2">📦 Envío</p>
                    <div className="space-y-1 text-blue-800">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Servicio:</span>
                        <span className="font-medium">{order.shipment.serviceName || order.shipment.service}</span>
                      </div>
                      {order.shipment.cost && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Costo:</span>
                          <span className="font-medium text-blue-600">{currencyFormat(order.shipment.cost)}</span>
                        </div>
                      )}
                      {order.shipment.estimatedDays && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimado:</span>
                          <span className="font-medium">{order.shipment.estimatedDays} {order.shipment.estimatedDays === 1 ? 'día' : 'días'}</span>
                        </div>
                      )}
                      {order.shipment.tracking && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seguimiento:</span>
                          <span className="font-mono text-xs">{order.shipment.tracking}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href={`/order/${order.id}/payment`}
                  className="flex-1 text-center btn-primary"
                >
                  Ver detalles
                </Link>
                {order.status === 'PENDING' && !order.payment && (
                  <Link 
                    href={`/order/${order.id}/payment`}
                    className="flex-1 text-center btn-secondary"
                  >
                    Completar pago
                  </Link>
                )}
                {(order.status === 'PENDING' || order.status === 'PAID') && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancelingOrderId === order.id}
                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelingOrderId === order.id ? 'Cancelando...' : 'Cancelar orden'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersClient;