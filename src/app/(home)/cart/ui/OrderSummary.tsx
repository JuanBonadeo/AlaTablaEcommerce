'use client'

import { useCartStore } from "@/lib/store/cart-stores"
import { useEffect, useState } from "react"
import { currencyFormat } from "@/lib/helpers/currencyFormat"
import { useRouter } from 'next/navigation'
import { OrderSummarySkeleton } from "@/components/ui/skeletons/OrderSummarySkeleton"

export const OrderSummary = () => {
    const router = useRouter()
    const [notification, setNotification] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const { itemsIn, subTotal, total } = useCartStore(state => state.getSummaryInfo())
    const validateForCheckout = useCartStore(state => state.validateForCheckout)

    const onCheckout = () => {
        // validate cart and address via cart store helper
        const validation = validateForCheckout();
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

    if (!loaded) {
        return <OrderSummarySkeleton />
    }

    return (
        <div>
            {notification && (
                <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 text-red-400 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-start gap-2">
                        <div className="text-xs sm:text-sm leading-relaxed">{notification}</div>
                        <button 
                            onClick={() => setNotification(null)} 
                            className="text-xs opacity-70 hover:opacity-100 flex-shrink-0 transition-opacity px-2 py-1 hover:bg-red-500/20 rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3 sm:space-y-4">
                {/* Items Row */}
                <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-xs sm:text-sm text-gray-400 font-medium">Productos</span>
                    </div>
                    <span className="text-sm sm:text-base text-white font-semibold">{itemsIn} {itemsIn === 1 ? 'item' : 'items'}</span>
                </div>

                {/* Subtotal Row */}
                <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-xs sm:text-sm text-gray-400 font-medium">Subtotal</span>
                    </div>
                    <span className="text-sm sm:text-base text-white font-semibold">{currencyFormat(subTotal)}</span>
                </div>

                {/* Total Row - Destacado */}
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 rounded-xl p-3 sm:p-4 border border-orange-500/20 mt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-base sm:text-xl text-white font-bold">Total</span>
                        <span className="text-xl sm:text-2xl text-orange-500 font-bold tracking-tight">{currencyFormat(total)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-5 sm:mt-6 w-full">
                <button 
                    onClick={onCheckout} 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl text-sm sm:text-base transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Proceder al pago
                </button>
                <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3">Pago seguro y encriptado</p>
            </div>
        </div>
    )
}
