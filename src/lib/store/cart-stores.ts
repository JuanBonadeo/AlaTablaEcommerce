import type { CartItem } from "@/lib/types/cart.types";
import { ShippingQuoteResponse } from "@/lib/types/shipping.types";
import { add } from "winston";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculatePrice } from "@/lib/utils/pricing";


const computeSummary = (cart: CartItem[], envio: number) => {
    // Calcular subtotal considerando ofertas
    const subTotal = cart.reduce((total, product) => {
        const priceInfo = calculatePrice(product.price, product.offer)
        return total + (priceInfo.finalPrice * product.quantity)
    }, 0)
    const total = subTotal + envio
    const itemsIn = cart.reduce((total, item) => total + item.quantity, 0)
    return { subTotal, envio, total, itemsIn }
}


interface State {
    cart: CartItem[]
    summary: {
        subTotal: number;
        envio: number;
        total: number;
        itemsIn: number;
    }

    // current shipping value (separate field so it can be set independently)
    shipping: number
    
    // información completa del envío seleccionado
    shippingQuote: ShippingQuoteResponse | null

    getTotalItems: () => number
    getSummaryInfo: () => {
        subTotal: number;
        envio: number;
        total: number;
        itemsIn: number;
    }
    addProductToCart: (product: CartItem) => void
    setShipping: (amount: number) => void
    setShippingQuote: (quote: ShippingQuoteResponse) => void
    clearShippingQuote: () => void
    getShippingQuote: () => ShippingQuoteResponse | null
    validateForCheckout: (addressSelected?: boolean) => { ok: boolean; message?: string }
    updateProductQuantity: (product: CartItem, quantity: number) => void
    removeProduct: (product: CartItem) => void
    clearCart: () => void

}


export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],
            // cache summary in state to return a stable reference for selectors
            // include envio (shipping) in the cached summary
            summary: {
                subTotal: 0,
                envio: 0,
                total: 0,
                itemsIn: 0,
            },
            // current shipping value (can be updated from checkout/address components)
            shipping: 0,
            // información completa del envío seleccionado
            shippingQuote: null,


            // methods

            getTotalItems: () => {
                const { summary } = get()
                return summary.itemsIn
            },


            getSummaryInfo: () => {
                // Return cached summary to keep selector snapshot stable
                return get().summary
            },

            setShipping: (amount: number) => {
                const { cart } = get()
                set({ shipping: amount, summary: computeSummary(cart, amount) })
            },

            setShippingQuote: (quote: ShippingQuoteResponse) => {
                const { cart } = get()
                set({ 
                    shippingQuote: quote, 
                    shipping: quote.cost, 
                    summary: computeSummary(cart, quote.cost) 
                })
            },

            clearShippingQuote: () => {
                const { cart } = get()
                set({ 
                    shippingQuote: null, 
                    shipping: 0, 
                    summary: computeSummary(cart, 0) 
                })
            },

            getShippingQuote: () => {
                return get().shippingQuote
            },

            validateForCheckout: (_addressSelected: boolean = false) => {
                const { cart } = get();
                if (!cart || cart.length === 0) return { ok: false, message: 'El carrito está vacío' };
                // No validar dirección seleccionada: se permite continuar sin dirección
                return { ok: true };
            },


            addProductToCart: (product: CartItem) => {
                const { cart } = get()

                // revisar si el producto existe en el carrito con su size
                const productInCart = cart.some(
                    (item) => (item.productId === product.productId && item.variantId === product.variantId)
                )

                if (!productInCart) {
                    const updatedCart = [...cart, product]
                    set({ cart: updatedCart, summary: computeSummary(updatedCart, get().shipping) })
                    return
                }

                // incremento la quantity del producto/variante
                const updatedCart = cart.map(item => {
                    if (item.productId === product.productId && item.variantId === product.variantId) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }

                    return item
                })
                set({ cart: updatedCart, summary: computeSummary(updatedCart, get().shipping) })
            },

            updateProductQuantity: (product: CartItem, quantity: number) => {
                const { cart } = get()

                const updatedCart = cart.map(item => {
                    if (item.productId === product.productId && item.variantId === product.variantId) {
                        return { ...item, quantity: quantity }
                    }
                    return item
                })
                set({ cart: updatedCart, summary: computeSummary(updatedCart, get().shipping) })
            },


            removeProduct: (product: CartItem) => {
                const { cart } = get()

                const updatedCart = cart.filter(item => item.productId !== product.productId || item.variantId !== product.variantId)
                set({ cart: updatedCart, summary: computeSummary(updatedCart, get().shipping) })
            },
            
            clearCart: () => {
                const updatedCart: CartItem[] = []
                set({ 
                    cart: updatedCart, 
                    summary: computeSummary(updatedCart, 0),
                    shipping: 0,
                    shippingQuote: null
                });
            },
            

        })
        , {
            name: 'shopping-cart',
        }
    )

);