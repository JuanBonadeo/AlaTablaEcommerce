'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductsIncart } from '../../(checkout)/ui/ProductsIncart';
import { useCartStore } from '@/lib/store/cart-stores';
import { useAddressStore } from '@/lib/store/address-store';
import { getMyAddressesAction } from '@/lib/actions/address/address.actions';
import { createOrderAction } from '@/lib/actions/order/order.actions';
import { authClient } from '@/lib/auth/auth-client';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { Address } from '@/lib/types/address.types';
import { ConfirmOrderSkeleton } from '@/components/ui/skeletons/ConfirmOrderSkeleton';
import { AlertOctagon, CheckCircle2, Info, MapPin, Package, Smartphone, X, Wallet, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmOrderClient = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [processingText, setProcessingText] = useState('Procesando...');
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'mercadopago'>('transfer');
  const [notification, setNotification] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  const addressId = useAddressStore(state => state.addressId);
  const { itemsIn, subTotal, total } = useCartStore(state => state.getSummaryInfo());
  const cart = useCartStore(state => state.cart);
  const validateForCheckout = useCartStore(state => state.validateForCheckout);
  const shippingQuote = useCartStore(state => state.getShippingQuote());

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (isCreatingOrder) {
      setProcessingText('Procesando...');
      const timer = setTimeout(() => {
        setProcessingText('¡Ya casi es tuyo!');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCreatingOrder]);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    (async () => {
      try {
        const userId = session?.user?.id || '';
        const list = await getMyAddressesAction(userId as string);
        if (addressId) {
          const found = list.find((a: Address) => a.id === addressId);
          setAddress(found || null);
        } else {
          const def = list.find((a: Address) => a.isDefault) || list[0] || null;
          setAddress(def);
        }
      } catch {
        setAddress(null);
      }
    })();
  }, [addressId, session]);

  const onConfirm = async () => {
    if (isCreatingOrder) return;

    setIsCreatingOrder(true);

    try {
      const userId = session?.user?.id;

      if (!userId) {
        setNotification({ type: 'error', message: 'Debes iniciar sesión para crear una orden' });
        setIsCreatingOrder(false);
        return;
      }

      // validate cart and address via cart store helper
      const validation = validateForCheckout();
      if (!validation.ok) {
        // Show inline notification only; do not redirect from Confirm page
        setNotification({ type: 'error', message: validation.message || 'Error en el carrito' });
        setIsCreatingOrder(false);
        return;
      }

      // Crear la orden
      const orderData = {
        userId,
        addressId: address?.id,
        total,
        items: cart.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping: shippingQuote
          ? {
            carrier: shippingQuote.carrier,
            service: shippingQuote.service,
            serviceName: shippingQuote.serviceName,
            cost: shippingQuote.cost,
            estimatedDays: shippingQuote.estimatedDays,
          }
          : undefined,
        paymentMethod,
      };

      const result = await createOrderAction(orderData);

      if (!result.success) {
        const errorMessage = result.message || 'Error al crear la orden';

        if (errorMessage.toLowerCase().includes('stock insuficiente')) {
          setNotification({ type: 'error', message: `${errorMessage}. Por favor, actualiza las cantidades en tu carrito.` });
        } else if (errorMessage.toLowerCase().includes('no encontrad')) {
          setNotification({ type: 'error', message: `${errorMessage}. Algún producto ya no está disponible. Revisa tu carrito.` });
        } else {
          setNotification({ type: 'error', message: errorMessage });
        }

        setIsCreatingOrder(false);
        return;
      }

      // Guardar método de pago
      try {
        localStorage.setItem('checkoutPayment', JSON.stringify({ method: paymentMethod, orderId: result.data?.id }));
      } catch (e) {
        console.warn('Could not save payment method', e);
      }

      // Redirigir a la página de pago para ambos métodos
      // El usuario podrá iniciar el pago desde allí
      if (result.data?.id) {
        router.push(`/order/${result.data.id}/payment`);
      } else {
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear la orden';

      if (errorMsg.toLowerCase().includes('stock')) {
        setNotification({ type: 'error', message: `⚠️ ${errorMsg}. Por favor, verifica las cantidades en tu carrito.` });
      } else {
        setNotification({ type: 'error', message: errorMsg });
      }

      setIsCreatingOrder(false);
    }
  };

  if (!loaded) return <ConfirmOrderSkeleton />;

  return (
    <motion.div 
      className="flex justify-center items-start py-4 sm:py-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-col w-full gap-6 sm:gap-8">

        {/* Header con pasos o titulo */}
        <motion.div 
          className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-gray-800/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.div 
            className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="text-white" size={24} />
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Confirmar Pedido</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Revisá los detalles antes de finalizar</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

          {/* Left: Cart (non editable) */}
          <motion.div 
            className="lg:col-span-7 space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Notification banner */}
            {notification && (
              <div className={`p-3 sm:p-4 rounded-xl border flex items-start gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                {notification.type === 'error' ? <AlertOctagon size={18} className="shrink-0 mt-0.5" /> : <Info size={18} className="shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm">{notification.message}</p>
                </div>
                <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100 flex-shrink-0"><X size={16} /></button>
              </div>
            )}

            <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border border-gray-800/50 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <Package className="text-orange-400" size={18} />
                  Carrito ({itemsIn})
                </h2>
                <button onClick={() => router.push('/cart')} className="text-xs sm:text-sm text-gray-400 hover:text-orange-400 hover:underline transition-colors">
                  Editar carrito
                </button>
              </div>
              <ProductsIncart />
            </div>

            <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border border-gray-800/50 rounded-2xl p-4 sm:p-6 shadow-xl">
              <h2 className="text-base sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-orange-400" size={18} />
                Envío y Entrega
              </h2>

              {address ? (
                <div className="pl-3 sm:pl-4 border-l-2 border-gray-700/50 space-y-1">
                  <p className="font-medium text-white text-sm sm:text-base">{address.firstName} {address.lastName}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{address.street} - {address.city}, {address.state} - CP {address.zip}</p>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-2">
                    <Smartphone size={12} /> {address.phone}
                  </p>
                </div>
              ) : (
                <div className="text-gray-500 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-800/20 rounded-lg text-xs sm:text-sm">
                  <span>No seleccionaste una dirección.</span>
                  <button onClick={() => router.push('/checkout/address')} className="text-orange-400 font-medium hover:underline">Elegir dirección</button>
                </div>
              )}

              {shippingQuote && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-gray-300 font-medium text-sm sm:text-base">{shippingQuote.serviceName}</span>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-green-400 text-sm sm:text-base">{currencyFormat(shippingQuote.cost)}</p>
                    <p className="text-xs text-gray-500">Llega en {shippingQuote.estimatedDays} días aprox.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Payment + Summary */}
          <motion.div 
            className="lg:col-span-5 flex flex-col gap-4 sm:gap-6 order-first lg:order-last"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >

            <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] border border-orange-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="h-1 w-8 bg-orange-500 rounded-full"></div>
                <h2 className="text-base sm:text-xl font-bold text-white">Resumen</h2>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">{currencyFormat(subTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Envío</span>
                  <span className={shippingQuote ? 'font-medium text-white' : 'text-gray-500'}>
                    {shippingQuote ? currencyFormat(shippingQuote.cost) : (address ? 'Calculando...' : '-')}
                  </span>
                </div>
                <div className="border-t border-gray-800/50 pt-2 sm:pt-3 flex justify-between items-end">
                  <span className="text-base sm:text-lg font-bold text-white">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-500">{currencyFormat(total)}</span>
                </div>
              </div>

              <div className="h-px bg-gray-800/50 mb-4 sm:mb-6" />

              <h3 className="text-sm sm:text-lg font-bold text-white mb-3 sm:mb-4">Forma de pago</h3>
              <div className="flex flex-col gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                {/* Transferencia Bancaria */}
                <motion.label
                  className={`
                    relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === 'transfer'
                      ? 'border-orange-500 bg-gradient-to-br from-orange-500/10 to-orange-600/5 shadow-lg ring-2 ring-orange-500/20'
                      : 'border-gray-700/50 bg-transparent hover:border-gray-600 hover:bg-gray-800/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="sr-only"
                  />
                  <motion.div 
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'transfer' ? 'border-orange-500' : 'border-gray-500'}`}
                  >
                    <AnimatePresence>
                      {paymentMethod === 'transfer' && (
                        <motion.div 
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 flex-shrink-0">
                      <Wallet size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className={`font-semibold text-sm sm:text-base ${paymentMethod === 'transfer' ? 'text-white' : 'text-gray-300'}`}>Transferencia</div>
                      {/* <div className="text-[10px] sm:text-xs text-gray-500">10% de descuento</div> */}
                    </div>
                  </div>
                </motion.label>

                {/* Mercado Pago */}
                <motion.label
                  className={`
                    relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === 'mercadopago'
                      ? 'border-orange-500 bg-gradient-to-br from-orange-500/10 to-orange-600/5 shadow-lg ring-2 ring-orange-500/20'
                      : 'border-gray-700/50 bg-transparent hover:border-gray-600 hover:bg-gray-800/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mercadopago'}
                    onChange={() => setPaymentMethod('mercadopago')}
                    className="sr-only"
                  />
                  <motion.div 
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'mercadopago' ? 'border-orange-500' : 'border-gray-500'}`}
                  >
                    <AnimatePresence>
                      {paymentMethod === 'mercadopago' && (
                        <motion.div 
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#009EE3]/10 flex items-center justify-center text-[#009EE3] flex-shrink-0">
                      <CreditCard size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className={`font-semibold text-sm sm:text-base ${paymentMethod === 'mercadopago' ? 'text-white' : 'text-gray-300'}`}>Mercado Pago</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Tarjetas, rapipago, etc.</div>
                    </div>
                  </div>
                </motion.label>
              </div>


              <motion.button
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                onClick={onConfirm}
                disabled={isCreatingOrder}
                whileHover={!isCreatingOrder ? { scale: 1.02 } : {}}
                whileTap={!isCreatingOrder ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {isCreatingOrder ? (
                    <motion.span 
                      key={processingText}
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 size={18} />
                      </motion.div>
                      {processingText}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="confirm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Confirmar y Pagar
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3">Pago seguro y encriptado</p>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default ConfirmOrderClient;
