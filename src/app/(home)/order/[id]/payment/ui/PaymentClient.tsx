'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderByIdAction } from '@/lib/actions/order/order.actions';
import { markPaymentAsTransferredAction } from '@/lib/actions/payment/payment.actions';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { Order } from '@/lib/types/order.types';
import Image from 'next/image';
import { PaymentClientSkeleton } from '@/components/ui/skeletons/PaymentClientSkeleton';

const BANK_ALIAS = 'ALAT.ECOMMERCE.ALIAS';
const BANK_ACCOUNT = 'CBU: 0000000000000000000000';

const PaymentClient = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'mercadopago'>('transfer');
  const [redirectingToMP, setRedirectingToMP] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const result = await getOrderByIdAction(orderId);
        
        if (!result) {
          setError('Error al cargar la orden');
          return;
        }
        
        setOrder(result);

        // Cargar método de pago desde localStorage
        try {
          const savedPayment = localStorage.getItem('checkoutPayment');
          if (savedPayment) {
            const { method } = JSON.parse(savedPayment);
            setPaymentMethod(method || 'transfer');
          }
        } catch (e) {
          console.warn('Could not load payment method', e);
        }
      } catch (err) {
        setError('Error al cargar la orden');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copyAlias = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ALIAS);
      setCopied(true);
    } catch (e) {
      console.warn('No se pudo copiar el alias', e);
    }
  };

  const handleMarkAsTransferred = async () => {
    try {
      setMarking(true);
      const result = await markPaymentAsTransferredAction(orderId);
      
      if (!result.success) {
        alert(result.message || 'Error al marcar el pago');
        return;
      }
      
      // Reload order to get updated payment status
      const orderResult = await getOrderByIdAction(orderId);
      if (orderResult) {
        setOrder(orderResult);
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const handlePayWithMercadoPago = async () => {
    try {
      setRedirectingToMP(true);
      const preferenceResponse = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const preferenceData = await preferenceResponse.json();

      if (preferenceData.success) {
        const paymentUrl = preferenceData.data.sandbox_init_point || preferenceData.data.init_point;
        window.location.href = paymentUrl;
      } else {
        alert('Error al crear preferencia de pago');
        setRedirectingToMP(false);
      }
    } catch (error) {
      console.error('Error creating Mercado Pago preference:', error);
      alert('Error al procesar el pago con Mercado Pago');
      setRedirectingToMP(false);
    }
  };

  if (loading) {
    return <PaymentClientSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Orden no encontrada'}</p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const paymentStatus = order.payment?.status || 'PENDING';
  const isTransferred = paymentStatus === 'TRANSFERRED';
  const isCompleted = paymentStatus === 'COMPLETED';

  return (
    <div className="flex justify-center items-start mb-20 px-2 lg:px-0 ">
      <div className="flex flex-col w-full max-w-[1000px] gap-6 ">
        
        {/* Order Info Header */}
        <div className="bg rounded-xl shadow-lg p-6 border border-gray-600">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Orden #{order.id.slice(-8)}</h2>
              <p className="text-sm text-gray-600">
                Estado: <span className="font-medium text-orange-600">{order.status}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Creada el</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Order Items */}
          <div className="bg rounded-xl shadow-lg p-6 border border-gray-600">
            <h3 className="text-xl font-semibold mb-4">Productos</h3>
            
            <div className="space-y-4 mb-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-600 last:border-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                    <h4 className="font-medium truncate">{item.product?.name}</h4>
                    {item.variant && (
                      <p className="text-sm text-gray-600">Variante: {item.variant.name}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Cantidad: {item.quantity}</span>
                      <span className="font-medium">{currencyFormat(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({itemsCount} {itemsCount === 1 ? 'artículo' : 'artículos'})</span>
                <span className="font-medium">{currencyFormat(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">{currencyFormat(order.total - subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary">{currencyFormat(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Info */}
          <div className="flex flex-col gap-6">
            
            {/* Delivery Address */}
            {order.address && (
              <div className="bg rounded-xl shadow-lg p-6 border border-gray-600">
                <h3 className="text-xl font-semibold mb-3">Dirección de entrega</h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-base">{order.address.firstName} {order.address.lastName}</p>
                  <p className="text-gray-600">{order.address.street}</p>
                  <p className="text-gray-600">{order.address.city}, {order.address.state} - CP {order.address.zip}</p>
                  <p className="text-gray-600">Tel: {order.address.phone}</p>
                </div>
              </div>
            )}

            {/* Payment Instructions */}
            <div className="bg  rounded-xl shadow-lg p-6 border border-gray-600">
              <h3 className="text-xl font-semibold mb-3">Instrucciones de pago</h3>

              {/* Mercado Pago Payment */}
              {paymentMethod === 'mercadopago' ? (
                <>
                  <div className="bg rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Método de pago</p>
                    <p className="font-semibold text-lg">Mercado Pago</p>
                  </div>

                  <div className="bg rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Monto a pagar</p>
                    <p className="font-bold text-2xl text-primary">{currencyFormat(order.total)}</p>
                  </div>

                  {!isCompleted && (
                    <>
                      <div className="bg border rounded-lg p-4 text-sm text-blue-600">
                        <p className="font-medium mb-1">💳 Pago con Mercado Pago</p>
                        <p>Haz clic en el botón para ser redirigido a Mercado Pago y completar tu pago de forma segura.</p>
                      </div>

                      <button 
                        onClick={handlePayWithMercadoPago}
                        disabled={redirectingToMP}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                      >
                        {redirectingToMP ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                      <p className="font-medium mb-1">✓ Pago confirmado</p>
                      <p>Tu pago ha sido verificado y confirmado.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Transfer Payment */}
                  <div className="bg border  rounded-lg p-4 text-sm text-amber-600">
                    <p className="font-medium mb-1">⚠️ Importante</p>
                    <p>Una vez realizada la transferencia, tu orden será verificada en las próximas 24-48 horas.</p>
                  </div>
                  
                  <div className="bg rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Método de pago</p>
                    <p className="font-semibold text-lg">Transferencia Bancaria</p>
                  </div>

                  <div className="bg rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Monto a transferir</p>
                    <p className="font-bold text-2xl text-primary">{currencyFormat(order.total)}</p>
                  </div>

                  <div className="bg rounded-lg p-4 ">
                    <p className="text-sm text-gray-600">Alias bancario</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono font-semibold text-lg bg-gray-50 px-3 py-2 rounded border border-gray-200 text-black">
                        juanbonadeo04
                      </code>
                      <button 
                        onClick={copyAlias} 
                        className="btn-primary whitespace-nowrap"
                      >
                        {copied ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      CBU: <code className="font-mono">{BANK_ACCOUNT}</code>
                    </p>
                  </div>

                  {/* Payment Status & Mark as Transferred Button */}
                  {isTransferred && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                      <p className="font-medium mb-1">✓ Pago marcado como transferido</p>
                      <p>Tu pago está siendo verificado por el administrador. Recibirás una confirmación pronto.</p>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                      <p className="font-medium mb-1">✓ Pago confirmado</p>
                      <p>Tu pago ha sido verificado y confirmado.</p>
                    </div>
                  )}

                  {!isTransferred && !isCompleted && (
                    <button 
                      onClick={handleMarkAsTransferred}
                      disabled={marking}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                    >
                      {marking ? 'Confirmando...' : 'Marcar como transferido'}
                    </button>
                  )}
                </>
              )}

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="flex-1 btn-secondary" 
                onClick={() => router.push('/profile/orders')}
              >
                Ver mis órdenes
              </button>
              {/* <button 
                className="flex-1 btn-primary" 
                onClick={() => router.push('/')}
              >
                Volver al inicio
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentClient;
