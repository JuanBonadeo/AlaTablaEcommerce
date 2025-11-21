'use client'

import { useEffect, useState } from 'react';
import { getOrdersByUserIdAction } from '@/lib/actions/order/order.actions';
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

  useEffect(() => {
    const loadOrders = async () => {
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
    };

    if (userId) {
      loadOrders();
    }
  }, [userId]);

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
      'TRANSFERRED': 'bg-blue-50 text-blue-700',
      'COMPLETED': 'bg-green-50 text-green-700',
      'FAILED': 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg text-gray-700';
  };

  const getPaymentStatusText = (status?: string) => {
    if (!status) return 'Sin pago';
    const texts: Record<string, string> = {
      'PENDING': 'Pago pendiente',
      'TRANSFERRED': 'Transferido - En verificación',
      'COMPLETED': 'Pago confirmado',
      'FAILED': 'Pago fallido',
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6">
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersClient;