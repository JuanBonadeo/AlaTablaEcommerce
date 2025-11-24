'use client'

import { useCartStore } from "@/lib/store/cart-stores"
import { useEffect, useState } from "react"
import { currencyFormat } from "@/lib/helpers/currencyFormat"
import { useRouter } from 'next/navigation'

export const OrderSummary = () => {
    const router = useRouter()
    const [notification, setNotification] = useState<string | null>(null)
    const [, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const { itemsIn, subTotal, total} = useCartStore(state => state.getSummaryInfo()) 
    const validateForCheckout = useCartStore(state => state.validateForCheckout)

    const onCheckout = () => {
        const validation = validateForCheckout(false)
        if (validation.ok) {
            router.push('/checkout/address')
            return
        }

        if (validation.message && validation.message.toLowerCase().includes('dirección')) {
            setNotification(validation.message)
            router.push('/checkout/address')
            return
        }

        setNotification(validation.message || 'Error en el carrito')
    }

    return (
        <div>
            {notification && (
                <div className="mb-4 p-3 rounded-lg border bg border-red text-red-800">
                    <div className="flex justify-between items-start gap-4">
                        <div className="text-sm">{notification}</div>
                        <button onClick={() => setNotification(null)} className="text-sm opacity-70 hover:opacity-100">Cerrar</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 ">

                <span>Nro. Productos</span>
                <span className="text-right">{ `${itemsIn} artículos` } </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{ currencyFormat(total) }</span>

            </div>

            <div className="mt-5 mb-2 w-full">
                <button onClick={onCheckout} className="flex btn-primary justify-center w-full">Checkout</button>
            </div>
        </div>
    )
}
