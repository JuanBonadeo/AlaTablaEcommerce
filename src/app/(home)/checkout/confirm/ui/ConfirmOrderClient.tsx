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
import { AlertOctagon, CheckCircle2, CreditCard, Info, MapPin, Package, Smartphone, Wallet, X } from 'lucide-react';

const ConfirmOrderClient = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'mercadopago'>('transfer');
  const [notification, setNotification] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  const addressId = useAddressStore(state => state.addressId);
  const { itemsIn, subTotal, total, envio } = useCartStore(state => state.getSummaryInfo());
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);
  const validateForCheckout = useCartStore(state => state.validateForCheckout);
  const shippingQuote = useCartStore(state => state.getShippingQuote());

  useEffect(() => {
    setLoaded(true);
  }, []);

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
      const validation = validateForCheckout(!!address);
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
    <div className="flex justify-center items-start mb-20 px-4 xl:px-0 py-8">
      <div className="flex flex-col w-full max-w-[1000px] gap-8">

        {/* Header con pasos o titulo */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-800">
          <CheckCircle2 className="text-orange-400" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-white">Confirmar Pedido</h1>
            <p className="text-gray-400">Revisá los detalles antes de finalizar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Cart (non editable) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Notification banner */}
            {notification && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-500'
                }`}>
                {notification.type === 'error' ? <AlertOctagon size={20} className="shrink-0 mt-0.5" /> : <Info size={20} className="shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-medium text-sm">{notification.message}</p>
                </div>
                <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100"><X size={18} /></button>
              </div>
            )}

            <div className="bg-[#171718] border border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="text-orange-400" size={20} />
                  Carrito ({itemsIn})
                </h2>
                <button onClick={() => router.push('/cart')} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
                  Editar carrito
                </button>
              </div>
              <ProductsIncart />
            </div>

            <div className="bg-[#171718] border border-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-orange-400" size={20} />
                Envío y Entrega
              </h2>

              {address ? (
                <div className="pl-4 border-l-2 border-gray-700 space-y-1">
                  <p className="font-medium text-white">{address.firstName} {address.lastName}</p>
                  <p className="text-gray-400">{address.street} - {address.city}, {address.state} - CP {address.zip}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                    <Smartphone size={14} /> {address.phone}
                  </p>
                </div>
              ) : (
                <div className="text-gray-500 flex items-center gap-4 p-4 bg-gray-800/20 rounded-lg">
                  <span>No seleccionaste una dirección.</span>
                  <button onClick={() => router.push('/checkout/address')} className="text-orange-400 font-medium hover:underline">Elegir dirección</button>
                </div>
              )}

              {shippingQuote && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <span className="text-gray-300 font-medium">{shippingQuote.serviceName}</span>
                  <div className="text-right">
                    <p className="font-bold text-green-500">{currencyFormat(shippingQuote.cost)}</p>
                    <p className="text-xs text-gray-500">Llega en {shippingQuote.estimatedDays} días aprox.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Payment + Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            <div className="bg-[#171718] border border-gray-800 rounded-xl p-6 shadow-lg sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Resumen de cuenta</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">{currencyFormat(subTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span className={shippingQuote ? 'font-medium text-white' : 'text-gray-500'}>
                    {shippingQuote ? currencyFormat(shippingQuote.cost) : (address ? 'Calculando...' : '-')}
                  </span>
                </div>
                <div className="border-t border-gray-800 my-2 pt-2 flex justify-between items-end">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-orange-400">{currencyFormat(total)}</span>
                </div>
              </div>

              <div className="h-px bg-gray-800 mb-6" />

              <h3 className="text-lg font-bold text-white mb-4">Forma de pago</h3>
              <div className="flex flex-col gap-3 mb-8">
                {/* Transferencia Bancaria */}
                <label
                  className={`
                    relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === 'transfer'
                      ? 'border-orange-400 bg-orange-400/5'
                      : 'border-gray-700 bg-transparent hover:border-gray-600 hover:bg-gray-800'
                    } shadow-lg shadow-orange-900/20
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-orange-500' : 'border-gray-500'}`}>
                    {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />}
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <div className={`font-semibold ${paymentMethod === 'transfer' ? 'text-white' : 'text-gray-300'}`}>Transferencia</div>
                      <div className="text-xs text-gray-500">10% de descuento</div>
                    </div>
                  </div>
                </label>

                {/* Mercado Pago */}
                <label
                  className={`
                    relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === 'mercadopago'
                      ? 'border-orange-400 bg-orange-400/5'
                      : 'border-gray-700 bg-transparent hover:border-gray-600 hover:bg-gray-800'
                    } shadow-lg shadow-orange-900/20
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mercadopago'}
                    onChange={() => setPaymentMethod('mercadopago')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'mercadopago' ? 'border-orange-500' : 'border-gray-500'}`}>
                    {paymentMethod === 'mercadopago' && <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />}
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#009EE3]/10 flex items-center justify-center text-[#009EE3]">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <div className={`font-semibold ${paymentMethod === 'mercadopago' ? 'text-white' : 'text-gray-300'}`}>Mercado Pago</div>
                      <div className="text-xs text-gray-500">Tarjetas, rapipago, etc.</div>
                    </div>
                  </div>
                </label>
              </div>

              <button
                className="w-full py-4 btn-primary rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onConfirm}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? 'Procesando...' : 'Confirmar y Pagar'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfirmOrderClient;
