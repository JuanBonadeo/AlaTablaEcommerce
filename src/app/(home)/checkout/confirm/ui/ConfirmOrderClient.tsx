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

const ConfirmOrderClient = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [address, setAddress] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'mercadopago'>('transfer');

  const addressId = useAddressStore(state => state.addressId);
  const { itemsIn, subTotal, total } = useCartStore(state => state.getSummaryInfo());
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

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
          const found = list.find((a: any) => a.id === addressId);
          setAddress(found || null);
        } else {
          const def = list.find((a: any) => a.isDefault) || list[0] || null;
          setAddress(def);
        }
      } catch (e) {
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
        alert('Debes iniciar sesión para crear una orden');
        setIsCreatingOrder(false);
        return;
      }

      if (cart.length === 0) {
        alert('El carrito está vacío');
        setIsCreatingOrder(false);
        return;
      }

      // Create order
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
      };

      const result = await createOrderAction(orderData);

      if (!result.success) {
        // Check if it's a stock error
        const errorMessage = result.message || 'Error al crear la orden';
        
        if (errorMessage.toLowerCase().includes('stock insuficiente')) {
          alert(`⚠️ ${errorMessage}\n\nPor favor, actualiza las cantidades en tu carrito.`);
          router.push('/cart');
        } else if (errorMessage.toLowerCase().includes('no encontrad')) {
          alert(`⚠️ ${errorMessage}\n\nAlgún producto ya no está disponible. Revisa tu carrito.`);
          router.push('/cart');
        } else {
          alert(errorMessage);
        }
        
        setIsCreatingOrder(false);
        return;
      }

      // Persist payment method for next step
      try {
        localStorage.setItem('checkoutPayment', JSON.stringify({ method: paymentMethod }));
      } catch (e) {
        console.warn('Could not save payment method', e);
      }

      // Clear cart
      clearCart();

      // Redirect to payment page with order ID
      router.push(`/order/${result.data.id}/payment`);
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear la orden';
      
      if (errorMsg.toLowerCase().includes('stock')) {
        alert(`⚠️ ${errorMsg}\n\nPor favor, verifica las cantidades en tu carrito.`);
        router.push('/cart');
      } else {
        alert(errorMsg);
      }
      
      setIsCreatingOrder(false);
    }
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="flex justify-center items-center mb-20 px-2 lg:px-0">
      <div className="flex flex-col w-[1000px] gap-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Left: Cart (non editable) */}
          <div className="bg rounded-xl shadow-xl p-6">
            <h2 className="text-2xl mb-4">Carrito</h2>
            <div className="text-sm text-gray-600 mb-4">No podés editar el carrito desde aquí — volvé a la página del carrito para cambios.</div>
            <ProductsIncart />
          </div>

          {/* Right: Address + Payment */}
          <div className="bg rounded-xl shadow-xl p-6">
            <h2 className="text-2xl mb-3">Dirección de entrega</h2>
            {address ? (
              <div className="mb-4">
                <p className="font-medium">{address.firstName} {address.lastName}</p>
                <p className="text-sm">{address.street} - {address.city}, {address.state} - CP {address.zip}</p>
                <p className="text-sm">{address.phone}</p>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-500">No hay dirección seleccionada. <button onClick={() => router.push('/checkout/address')} className="underline text-primary">Elegir dirección</button></div>
            )}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-4" />

            <h2 className="text-2xl mb-3">Resumen de orden</h2>
            <div className="grid grid-cols-2 mb-4">
              <span>Nro. Productos</span>
              <span className="text-right">{itemsIn === 1 ? '1 artículo' : `${itemsIn} artículos`}</span>
              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(subTotal)}</span>
              <span>Envio</span>

              {address ? <span className="text-right">{currencyFormat(7500)}</span> : <span className="text-right">-</span>}
              
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-4" />

            <h3 className="text-lg mb-2">Forma de pago</h3>
            <div className="flex flex-col gap-3 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                <span className="ml-2">Transferencia bancaria</span>
              </label>

              <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
                <input type="radio" name="payment" disabled checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} />
                <span className="ml-2">Mercado Pago <span className="text-xs text-gray-500">(Próximamente)</span></span>
              </label>
            </div>

            <div className="flex justify-end">
              <button 
                className="btn-primary" 
                onClick={onConfirm}
                disabled={isCreatingOrder || !address}
              >
                {isCreatingOrder ? 'Creando orden...' : 'Confirmar y pagar'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfirmOrderClient;
