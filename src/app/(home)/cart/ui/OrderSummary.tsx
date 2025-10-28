'use client'

import { useCartStore } from "@/lib/store/cart-stores"
import { useEffect, useState } from "react"
import { currencyFormat } from "@/lib/helpers/currencyFormat"

export const OrderSummary = () => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])
 

    const { itemsIn, subTotal, total} = useCartStore(state => state.getSummaryInfo()) 

    return (
        <div className="grid grid-cols-2 ">

            <span>Nro. Productos</span>
            <span className="text-right">{ `${itemsIn} artículos` } </span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

          

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{ currencyFormat(total) }</span>

        </div>
    )
}
