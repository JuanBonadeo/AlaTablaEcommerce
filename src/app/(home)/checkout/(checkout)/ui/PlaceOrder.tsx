"use client";

import { useEffect, useState } from "react"
import { createOrderAction } from "@/lib/actions/order/order.actions"
import { useAddressStore } from "@/lib/store/address-store"
import { useCartStore } from "@/lib/store/cart-stores"
import { currencyFormat } from "@/lib/helpers/currencyFormat"
import clsx from "clsx"
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  

    const addressId = useAddressStore(state => state.addressId)
    const { itemsIn, subTotal, total } = useCartStore(state => state.getSummaryInfo())
    const cart  = useCartStore( state => state.cart)
    const clearCart  = useCartStore( state => state.clearCart)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const onPlaceOrder = async() => {
        setIsPlacingOrder(true);
        

        if (!addressId) {
          setErrorMessage('Por favor selecciona una dirección de entrega');
          setIsPlacingOrder(false);
          return;
        }
    
        const productsToOrder = cart.map( product => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
          variantId: product.variantId,
        }))
    
    
        //! Server Action
        const resp = await createOrderAction({
          items: productsToOrder,
          addressId: addressId,
          total: total,
          userId: '', // This will be set by the server from session
        });
        if ( !resp.success ) {
          setIsPlacingOrder(false);
          setErrorMessage(resp.message || 'Error al crear la orden');
          return;
        }
    
        //* Todo salio bien!
        clearCart();
        router.replace('/orders/' + resp.data?.id );
    
    
      }

    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                {addressId ? (
                  <p className="text-sm text-gray-600">Dirección seleccionada: {addressId}</p>
                ) : (
                  <p className="text-sm text-red-600">No hay dirección seleccionada</p>
                )}
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">

                <span>Nro. Productos</span>
                <span className="text-right">{itemsIn === 1 ? '1 artículo' : `${itemsIn} artículos`} </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>



            </div>

            <div className="mt-5 mb-2 w-full">

                <p className="mb-5">
                    {/* Disclaimer */}
                    <span className="text-xs">
                        Al hacer clic en Colocar orden, aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                    </span>
                </p>


                <p className="text-red-500">{ errorMessage }</p>

                <button
                    onClick={onPlaceOrder}
                    className={
                        clsx({
                           'btn-primary': !isPlacingOrder,
                           'btn-disabled': isPlacingOrder

                        })
                    }
                >
                    Colocar orden
                </button>
            </div>


        </div>

    )
}
