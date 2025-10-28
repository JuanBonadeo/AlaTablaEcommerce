"use client";

import { useEffect, useState } from "react"
import { placeOrder } from "@/actions/order/place-order"
import { useAddressStore } from "@/store/address/address-store"
import { useCartStore } from "@/store/cart/cart-stores"
import { currencyFormat } from "@/utils/currencyFormat"
import clsx from "clsx"
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  

    const address = useAddressStore(state => state.address)
    const { itemsIn, subTotal, tax, total } = useCartStore(state => state.getSummaryInfo())
    const cart  = useCartStore( state => state.cart)
    const clearCart  = useCartStore( state => state.clearCart)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const onPlaceOrder = async() => {
        setIsPlacingOrder(true);
        
    
        const productsToOrder = cart.map( product => ({
          productId: product.id,
          quantity: product.quantity,
          size: product.size,
        }))
    
    
        //! Server Action
        const resp = await placeOrder( productsToOrder, address);
        if ( !resp.ok ) {
          setIsPlacingOrder(false);
          setErrorMessage(resp.message);
          return;
        }
    
        //* Todo salio bien!
        clearCart();
        router.replace('/orders/' + resp.order?.id );
    
    
      }

    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>CP {address.city}</p>
                <p>CP {address.postalCode}</p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">

                <span>Nro. Productos</span>
                <span className="text-right">{itemsIn === 1 ? '1 artículo' : `${itemsIn} artículos`} </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

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
