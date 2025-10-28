import type { CartItem } from "@/lib/types/cart.types";
import { add } from "winston";
import { create } from "zustand";
import { persist } from "zustand/middleware";


const computeSummary = (cart: CartItem[]) => {
    const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price) + subTotal, 0)
    const envio = 0
    const total = subTotal + envio
    const itemsIn = cart.reduce((total, item) => total + item.quantity, 0)
    return { subTotal, envio, total, itemsIn }
}


interface State {
    cart: CartItem[]
    summary: {
        subTotal: number;
        total: number;
        itemsIn: number;
    }

    getTotalItems: () => number
    getSummaryInfo: () => {
        subTotal: number;
        total: number;
        itemsIn: number;
    }
    addProductToCart: (product: CartItem) => void
    updateProductQuantity: (product: CartItem, quantity: number) => void
    removeProduct: (product: CartItem) => void
    clearCart: () => void

}


export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],
            // cache summary in state to return a stable reference for selectors
            summary: {
                subTotal: 0,
                total: 0,
                itemsIn: 0,
            },


            // methods

            getTotalItems: () => {
                const { summary } = get()
                return summary.itemsIn
            },


            getSummaryInfo: () => {
                // return cached summary object (stable reference) to avoid
                // creation of a new object on every call which can cause
                // hydration/infinite loop issues with useSyncExternalStore
                return get().summary
            },


            addProductToCart: (product: CartItem) => {
                const { cart } = get()

                // revisar si el producto existe en el carrito con su size
                const productInCart = cart.some(
                    (item) => (item.productId === product.productId && item.variantId === product.variantId)
                )

                if (!productInCart) {
                    const updatedCart = [...cart, product]
                    set({ cart: updatedCart, summary: computeSummary(updatedCart) })
                    return
                }

                // incremento la quantity del producto/variante
                const updatedCart = cart.map(item => {
                    if (item.productId === product.productId && item.variantId === product.variantId) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }

                    return item
                })
                set({ cart: updatedCart, summary: computeSummary(updatedCart) })
            },



            updateProductQuantity: (product: CartItem, quantity: number) => {
                const { cart } = get()

                const updatedCart = cart.map(item => {
                    if (item.productId === product.productId && item.variantId === product.variantId) {
                        return { ...item, quantity: quantity }
                    }
                    return item
                })
                set({ cart: updatedCart, summary: computeSummary(updatedCart) })
            },


            removeProduct: (product: CartItem) => {
                const { cart } = get()

                const updatedCart = cart.filter(item => item.productId !== product.productId || item.variantId !== product.variantId)
                set({ cart: updatedCart, summary: computeSummary(updatedCart) })
            },
            clearCart: () => {
                const updatedCart: CartItem[] = []
                set({ cart: updatedCart, summary: computeSummary(updatedCart) });
            },
            

        })
        , {
            name: 'shopping-cart',
        }
    )

);