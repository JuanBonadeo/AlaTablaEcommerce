'use client'

import { useCartStore } from "@/store/cart/cart-stores"
import { useEffect, useState } from "react"
import { currencyFormat } from '../../../../utils/currencyFormat';

export const OrderSummary = () => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])


    const { itemsIn, subTotal, tax, total} = useCartStore(state => state.getSummaryInfo()) 

    return (
        <div className="grid grid-cols-2">

            <span>Nro. Productos</span>
            <span className="text-right">{ itemsIn === 1 ? '1 artículo' : `${itemsIn} artículos` } </span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Impuestos (15%)</span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{ currencyFormat(total) }</span>

        </div>
    )
}
