'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderByIdAction } from '@/lib/actions/order/order.actions';
import { markPaymentAsTransferredAction } from '@/lib/actions/payment/payment.actions';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { Order } from '@/lib/types/order.types';
import Image from 'next/image';
import { PaymentClientSkeleton } from '@/components/ui/skeletons/PaymentClientSkeleton';
import { CreditCard, ArrowLeft, CheckCircle, Copy, AlertTriangle, Package, MapPin, Truck, Loader2 } from 'lucide-react';

const BANK_ALIAS = 'alatabla.store';
const BANK_ACCOUNT = 'CBU: 0000003100039880469928';

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
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loadingPreference, setLoadingPreference] = useState(false);

  // Función para crear preferencia de Mercado Pago
  const createMercadoPagoPreference = async () => {
    try {
      setLoadingPreference(true);
      const preferenceResponse = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const preferenceData = await preferenceResponse.json();

      if (preferenceData.success && preferenceData.data?.id) {
        setPreferenceId(preferenceData.data.id);
      } else {
        alert('Error al crear preferencia de pago: ' + (preferenceData.message || 'Intente nuevamente'));
      }
    } catch (error) {
      console.error('Error creating Mercado Pago preference:', error);
      alert('Error al procesar el pago con Mercado Pago');
    } finally {
      setLoadingPreference(false);
    }
  };

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

  // Cargar SDK de Mercado Pago
  useEffect(() => {
    if (paymentMethod === 'mercadopago' && !preferenceId) {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [paymentMethod, preferenceId]);

  // Crear preferencia cuando se carga la página con método Mercado Pago
  useEffect(() => {
    if (paymentMethod === 'mercadopago' && !preferenceId && !loadingPreference) {
      createMercadoPagoPreference();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, preferenceId]); // Removed loadingPreference to avoid loops

  // Renderizar botón de Mercado Pago cuando tengamos el preference ID
  useEffect(() => {
    if (preferenceId && paymentMethod === 'mercadopago') {
      const renderButton = async () => {
        const mpKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
        if (!mpKey) {
          console.error("Missing Mercado Pago Public Key");
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mp = new (window as any).MercadoPago(mpKey, {
          locale: 'es-AR'
        });

        const bricksBuilder = mp.bricks();

        // Limpiar contenedor previo si existe
        const container = document.getElementById('wallet_container');
        if (container) container.innerHTML = '';

        await bricksBuilder.create('wallet', 'wallet_container', {
          initialization: {
            preferenceId: preferenceId,
          },
          customization: {
            visual: {
              buttonBackground: 'black',
              borderRadius: '16px',
            },
            texts: {
              valueProp: 'smart_option',
            },
          },
        });
      };

      // Esperar a que el SDK esté disponible
      const checkSDK = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).MercadoPago) {
          clearInterval(checkSDK);
          renderButton();
        }
      }, 100);

      return () => clearInterval(checkSDK);
    }
  }, [preferenceId, paymentMethod]);

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

  if (loading) {
    return <PaymentClientSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border-2 border-gray-800/50 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50">
              <AlertTriangle size={32} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">{error || 'Orden no encontrada'}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium border-2 border-transparent shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
          >
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
    <div className="flex justify-center items-start mb-20 px-3 sm:px-4 md:px-8 py-4 sm:py-8">
      <div className="flex flex-col w-full max-w-[1000px] gap-4 sm:gap-6 lg:gap-8">

        {/* Order Info Header */}
        <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl border-2 border-gray-800/50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-1">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg shadow-orange-500/50">
                <Package className="text-white" size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Orden #{order.id.slice(-8)}</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-xs font-medium border-2 ${order.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                  'bg-gray-800 text-gray-300 border-gray-700'
                }`}>
                {order.status}
              </span>
              <span className="text-gray-600">•</span>
              <span>Creada el {new Date(order.createdAt).toLocaleDateString('es-AR')}</span>
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => router.push('/profile/orders')}
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-orange-400 transition-colors hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft size={16} />
              Volver a mis órdenes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

          {/* Left: Order Items */}
          <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl border-2 border-gray-800/50 overflow-hidden shadow-xl">
            <div className="p-4 sm:p-6 border-b-2 border-gray-800/50">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Package size={18} className="text-orange-400" />
                Resumen del pedido
              </h3>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b-2 border-gray-800/50 last:border-0 last:pb-0">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#0a0a0a] rounded-lg border-2 border-gray-800/50 overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Package size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-gray-200 truncate pr-2 text-sm sm:text-base">{item.product?.name}</h4>
                        <span className="font-bold text-white text-sm flex-shrink-0">{currencyFormat(item.price * item.quantity)}</span>
                      </div>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">Variante: <span className="text-gray-400">{item.variant.name}</span></p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">Cant: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0a0a0a] rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 border-2 border-gray-800/50">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Subtotal ({itemsCount} items)</span>
                  <span className="font-medium text-gray-300">{currencyFormat(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Envío</span>
                  <span className="font-medium text-gray-300">{currencyFormat(order.total - subtotal)}</span>
                </div>
                <div className="border-t-2 border-gray-800/50 pt-2 sm:pt-3 mt-2 sm:mt-3 flex justify-between items-center text-base sm:text-lg">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-orange-500 text-lg sm:text-xl">{currencyFormat(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Info */}
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Delivery Address */}
            {order.address && (
              <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl border-2 border-gray-800/50 p-4 sm:p-6 shadow-xl">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-orange-400" />
                  Envío a
                </h3>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-2 border-orange-500/20 rounded-xl flex-shrink-0">
                    <Truck size={18} className="text-orange-400" />
                  </div>
                  <div className="text-xs sm:text-sm space-y-1">
                    <p className="font-medium text-white text-sm sm:text-base">{order.address.firstName} {order.address.lastName}</p>
                    <p className="text-gray-400">{order.address.street}</p>
                    <p className="text-gray-400">{order.address.city}, {order.address.state} - CP {order.address.zip}</p>
                    <p className="text-gray-500 mt-1 text-xs">Tel: {order.address.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Instructions */}
            <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl border-2 border-gray-800/50 overflow-hidden shadow-xl">
              <div className="p-4 sm:p-6 border-b-2 border-gray-800/50">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard size={18} className="text-orange-400" />
                  Pago
                </h3>
              </div>

              <div className="p-4 sm:p-6">
                {/* Mercado Pago Payment */}
                {paymentMethod === 'mercadopago' ? (
                  <div className="space-y-6">
                    <div className="">
                      {loadingPreference ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="animate-spin text-orange-400" size={32} />
                          <span className="ml-3 text-gray-400">Cargando Mercado Pago...</span>
                        </div>
                      ) : (
                        <div id="wallet_container" className="min-h-[50px] "></div>
                      )}
                    </div>

                    {isCompleted && (
                      <div className="bg-green-500/10 border-2 border-green-500/20 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-bold text-green-400 text-sm sm:text-base">Pago confirmado</p>
                          <p className="text-xs sm:text-sm text-green-300/70">Tu pedido está siendo procesado.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Transfer Payment */
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-orange-400/10 border-2 border-orange-400/20 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                      <AlertTriangle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                      <div className="text-sm text-orange-200/80">
                        <p className="font-bold text-orange-400 mb-1">Importante</p>
                        <p>Transferí el total y envíanos el comprobante. Tu pedido se procesará una vez verificado el pago.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-gray-400">Monto a transferir:</p>
                      <div className="bg-[#0a0a0a] border-2 border-gray-800/50 rounded-xl p-3 sm:p-4 flex justify-between items-center">
                        <span className="text-xl sm:text-2xl font-bold text-white">{currencyFormat(order.total)}</span>
                        <div className="px-2 sm:px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono">ARS</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-xs sm:text-sm text-gray-400">Alias CBU:</p>
                        {copied && <span className="text-xs text-green-400 animate-in fade-in slide-in-from-bottom-1">¡Copiado!</span>}
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 bg-[#0a0a0a] border-2 border-gray-800/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 font-mono text-white flex items-center text-sm sm:text-base">
                          {BANK_ALIAS}
                        </div>
                        <button
                          onClick={copyAlias}
                          className="px-3 sm:px-4 bg-gray-800 border-2 border-gray-700/50 hover:bg-gray-700 hover:border-gray-600 text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                          title="Copiar Alias"
                        >
                          {copied ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 font-mono pl-1">{BANK_ACCOUNT}</p>
                    </div>

                    {isTransferred ? (
                      <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <CheckCircle className="text-blue-500 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-bold text-blue-400 text-sm sm:text-base">Pago informado</p>
                          <p className="text-xs sm:text-sm text-blue-300/70">Estamos verificando tu transferencia.</p>
                        </div>
                      </div>
                    ) : isCompleted ? (
                      <div className="bg-green-500/10 border-2 border-green-500/20 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-bold text-green-400 text-sm sm:text-base">Pago confirmado</p>
                          <p className="text-xs sm:text-sm text-green-300/70">Tu pedido está siendo procesado.</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleMarkAsTransferred}
                        disabled={marking}
                        className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                      >
                        {marking ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Confirmando...
                          </>
                        ) : (
                          'Ya realicé la transferencia'
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentClient;
