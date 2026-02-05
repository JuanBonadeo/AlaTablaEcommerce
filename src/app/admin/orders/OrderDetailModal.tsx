'use client';

import { useState } from 'react';
import { X, Package, MapPin, CreditCard, Truck, User, Calendar, DollarSign } from 'lucide-react';
import { Order } from '@/lib/types/order.types';
import { ProductImage } from '@/components/product/prduct-image/ProductImage';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { createAndreaniShipmentAction } from '@/lib/actions/shipping/andreani.actions';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [isDownloadingLabel, setIsDownloadingLabel] = useState(false);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [shipmentStatus, setShipmentStatus] = useState<{
    status: string;
    location?: string;
    lastUpdate?: string;
    estimatedDelivery?: string;
  } | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);
  const [shipmentCreationError, setShipmentCreationError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400';
      case 'PAID': return 'text-blue-400';
      case 'SHIPPED': return 'text-purple-400';
      case 'DELIVERED': return 'text-green-400';
      case 'CANCELED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-400';
      case 'PENDING': return 'text-yellow-400';
      case 'TRANSFERRED': return 'text-blue-400';
      case 'FAILED': return 'text-red-400';
      case 'REFUNDED': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const handleDownloadLabel = async () => {
    try {
      setLabelError(null);
      setIsDownloadingLabel(true);

      const response = await fetch('/api/admin/shipping/label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success || !data?.data?.pdfBase64) {
        throw new Error(data?.message || 'No se pudo generar la etiqueta');
      }

      const pdfBase64 = data.data.pdfBase64 as string;
      const binary = Uint8Array.from(atob(pdfBase64), (char) => char.charCodeAt(0));
      const blob = new Blob([binary], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `etiqueta-${order.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setLabelError(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setIsDownloadingLabel(false);
    }
  };

  const handleGetShipmentStatus = async () => {
    try {
      setStatusError(null);
      setIsLoadingStatus(true);

      if (!order.shipment?.tracking) {
        throw new Error('No hay número de seguimiento para este envío');
      }

      const response = await fetch('/api/admin/shipping/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking: order.shipment.tracking }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'No se pudo obtener el estado del envío');
      }

      setShipmentStatus(data.data);
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleCreateAndreaniShipment = async () => {
    try {
      setShipmentCreationError(null);
      setIsCreatingShipment(true);

      const result = await createAndreaniShipmentAction(order.id);

      if (!result.ok) {
        throw new Error(result.message || 'No se pudo crear el envío');
      }

      // Refresh the page to show the new shipment
      window.location.reload();
    } catch (error) {
      setShipmentCreationError(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setIsCreatingShipment(false);
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
                  order.status === 'PAID' ? 'Pagado' :
                    order.status === 'SHIPPED' ? 'Enviado' :
                      order.status === 'DELIVERED' ? 'Entregado' :
                        'Cancelado'}
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Total</span>
              </div>
              <p className="text-green-400 font-bold text-xl">{currencyFormat(order.total)}</p>
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
                    {order.payment.status === 'COMPLETED' ? 'Pagado (Confirmado)' :
                      order.payment.status === 'PENDING' ? 'Pendiente' :
                        order.payment.status === 'TRANSFERRED' ? 'Transferido' :
                          order.payment.status === 'REFUNDED' ? 'Reembolsado' :
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-orange-400" />
                  <h3 className="text-lg font-bold text-white">Información de Envío</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.shipment.carrier === 'ENTREGA_LOCAL'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                  {order.shipment.carrier === 'ENTREGA_LOCAL' ? '🏠 Entrega Local' : '📦 ' + order.shipment.carrier}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estado</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${order.shipment.status === 'DELIVERED' ? 'bg-green-500' :
                      order.shipment.status === 'SHIPPED' ? 'bg-blue-500' :
                        order.shipment.status === 'PENDING' ? 'bg-yellow-500' :
                          'bg-gray-500'
                      }`} />
                    <p className={`font-semibold ${order.shipment.status === 'DELIVERED' ? 'text-green-400' :
                      order.shipment.status === 'SHIPPED' ? 'text-blue-400' :
                        order.shipment.status === 'PENDING' ? 'text-yellow-400' :
                          'text-gray-400'
                      }`}>
                      {order.shipment.status === 'DELIVERED' ? 'Entregado' :
                        order.shipment.status === 'SHIPPED' ? 'Enviado' :
                          order.shipment.status === 'PENDING' ? 'Pendiente' :
                            order.shipment.status}
                    </p>
                  </div>
                </div>
                {order.shipment.serviceName && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Servicio</p>
                    <p className="text-white font-medium">{order.shipment.serviceName}</p>
                  </div>
                )}
                {order.shipment.cost !== undefined && order.shipment.cost !== null && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Costo de envío</p>
                    <p className="text-green-400 font-semibold">{currencyFormat(order.shipment.cost)}</p>
                  </div>
                )}
                {order.shipment.estimatedDays && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Días estimados</p>
                    <p className="text-white font-medium">{order.shipment.estimatedDays} {order.shipment.estimatedDays === 1 ? 'día' : 'días'}</p>
                  </div>
                )}
                {order.shipment.tracking && (
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Código de Seguimiento</p>
                    <p className="text-white font-mono bg-gray-900 px-3 py-2 rounded border border-gray-800">
                      {order.shipment.tracking}
                    </p>
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

              {/* Solo mostrar acciones de Andreani si el carrier es ANDREANI */}
              {order.shipment.carrier === 'ANDREANI' && (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleDownloadLabel}
                      disabled={isDownloadingLabel}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      {isDownloadingLabel ? 'Generando etiqueta...' : 'Descargar etiqueta PDF'}
                    </button>
                    {order.shipment?.tracking && (
                      <button
                        onClick={handleGetShipmentStatus}
                        disabled={isLoadingStatus}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                      >
                        {isLoadingStatus ? 'Obteniendo estado...' : 'Obtener estado en vivo'}
                      </button>
                    )}
                  </div>
                  {labelError && <p className="text-sm text-red-400">{labelError}</p>}
                  {statusError && <p className="text-sm text-red-400">{statusError}</p>}

                  {/* Live Shipment Status */}
                  {shipmentStatus && (
                    <div className="bg-[#171718] border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-blue-400 font-semibold mb-3">Estado del Envío en Vivo</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Estado Actual</p>
                          <p className="text-white font-medium capitalize">{shipmentStatus.status}</p>
                        </div>
                        {shipmentStatus.location && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Ubicación</p>
                            <p className="text-white font-medium">{shipmentStatus.location}</p>
                          </div>
                        )}
                        {shipmentStatus.lastUpdate && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Última Actualización</p>
                            <p className="text-white text-sm">{new Date(shipmentStatus.lastUpdate).toLocaleString('es-ES')}</p>
                          </div>
                        )}
                        {shipmentStatus.estimatedDelivery && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Entrega Estimada</p>
                            <p className="text-white text-sm">{new Date(shipmentStatus.estimatedDelivery).toLocaleDateString('es-ES')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Create Andreani Shipment Button (when no shipment exists) */}
          {!order.shipment && order.address && (
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={20} className="text-orange-400" />
                <h3 className="text-lg font-bold text-white">Crear Envío</h3>
              </div>
              <p className="text-gray-400 mb-4">Esta orden aún no tiene un envío asociado. Puedes crear un envío con Andreani.</p>
              <button
                onClick={handleCreateAndreaniShipment}
                disabled={isCreatingShipment}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isCreatingShipment ? 'Creando envío con Andreani...' : 'Crear Envío con Andreani'}
              </button>
              {shipmentCreationError && <p className="text-sm text-red-400 mt-3">{shipmentCreationError}</p>}
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
                    <p className="text-white font-medium">{currencyFormat(item.price)}</p>
                    <p className="text-gray-400 text-sm">c/u</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{currencyFormat(item.price * item.quantity)}</p>
                    <p className="text-gray-400 text-sm">total</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-800">
              <p className="text-white font-bold text-lg">Total de la Orden</p>
              <p className="text-green-400 font-bold text-2xl">{currencyFormat(order.total)}</p>
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
