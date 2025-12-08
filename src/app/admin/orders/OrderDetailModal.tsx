'use client';

import { X, Package, MapPin, CreditCard, Truck, User, Calendar, DollarSign } from 'lucide-react';
import { Order } from '@/lib/types/order.types';
import { ProductImage } from '@/components/product/prduct-image/ProductImage';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400';
      case 'PROCESSING': return 'text-blue-400';
      case 'COMPLETED': return 'text-green-400';
      case 'CANCELED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-400';
      case 'PENDING': return 'text-yellow-400';
      case 'FAILED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#171718] border border-gray-800 rounded-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Package className="text-orange-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Detalle de Orden</h2>
              <p className="text-gray-400 text-sm">#{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Fecha</span>
              </div>
              <p className="text-white font-medium">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Estado</span>
              </div>
              <p className={`font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status === 'PENDING' ? 'Pendiente' :
                 order.status === 'PROCESSING' ? 'En Proceso' :
                 order.status === 'COMPLETED' ? 'Completado' :
                 'Cancelado'}
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Total</span>
              </div>
              <p className="text-green-400 font-bold text-xl">${order.total.toFixed(2)}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-orange-400" />
              <h3 className="text-lg font-bold text-white">Información del Cliente</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Nombre</p>
                <p className="text-white font-medium">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-medium">{order.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-orange-400" />
                <h3 className="text-lg font-bold text-white">Dirección de Envío</h3>
              </div>
              <div className="space-y-2">
                <p className="text-white">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="text-gray-300">{order.address.street}</p>
                <p className="text-gray-300">
                  {order.address.city}, {order.address.state} {order.address.zip}
                </p>
                <p className="text-gray-300">Tel: {order.address.phone}</p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          {order.payment && (
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-orange-400" />
                <h3 className="text-lg font-bold text-white">Información de Pago</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Método</p>
                  <p className="text-white font-medium capitalize">{order.payment.provider.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estado</p>
                  <p className={`font-medium capitalize ${getPaymentStatusColor(order.payment.status)}`}>
                    {order.payment.status === 'COMPLETED' ? 'Completado' :
                     order.payment.status === 'PENDING' ? 'Pendiente' :
                     'Fallido'}
                  </p>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">ID de Transacción</p>
                    <p className="text-white font-mono text-sm">{order.payment.transactionId}</p>
                  </div>
                )}
                {order.payment.notes && (
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Notas</p>
                    <p className="text-white">{order.payment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipment Info */}
          {order.shipment && (
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={20} className="text-orange-400" />
                <h3 className="text-lg font-bold text-white">Información de Envío</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estado</p>
                  <p className="text-white font-medium capitalize">{order.shipment.status.toLowerCase().replace('_', ' ')}</p>
                </div>
                {order.shipment.carrier && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Transportista</p>
                    <p className="text-white font-medium">{order.shipment.carrier}</p>
                  </div>
                )}
                {order.shipment.tracking && (
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Código de Seguimiento</p>
                    <p className="text-white font-mono">{order.shipment.tracking}</p>
                  </div>
                )}
                {order.shipment.shippedAt && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Enviado el</p>
                    <p className="text-white">{new Date(order.shipment.shippedAt).toLocaleDateString('es-ES')}</p>
                  </div>
                )}
                {order.shipment.deliveredAt && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Entregado el</p>
                    <p className="text-white">{new Date(order.shipment.deliveredAt).toLocaleDateString('es-ES')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Productos</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-800 last:border-0">
                  {item.product?.images?.[0] && (
                    <ProductImage
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.product?.name}</p>
                    {item.variant && (
                      <p className="text-gray-400 text-sm">Variante: {item.variant.name}</p>
                    )}
                    <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">c/u</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">total</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-800">
              <p className="text-white font-bold text-lg">Total de la Orden</p>
              <p className="text-green-400 font-bold text-2xl">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
