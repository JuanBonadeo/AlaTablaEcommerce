'use client'



import { useState } from "react";
import { QuantitySelector } from "../quantity-selector/QuantitySelector";
import { Product } from "@/lib/types/product.types";
import { useCartStore } from "@/lib/store/cart-stores";
import type { CartItem } from "@/lib/types/cart.types";


interface Props {
    product: Product;
}
export const AddToCart = ({ product }: Props) => {

    const addProuctToCart = useCartStore( state => state.addProductToCart);

    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState(false)
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
        product.variants && product.variants.length > 0 ? product.variants[0].id : undefined
    )
    const [showNotification, setShowNotification] = useState(false)

    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId)

    const getImage = () => {
        if (!product.images || product.images.length === 0) return ""
        const first = product.images[0]
        if (typeof first === 'string') return first
        return first.url
    }

    const addToCart = () => {
        setPosted(true)

        const cartProduct: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: selectedVariant?.price ?? product.price,
            variantId: selectedVariant?.id,
            variantName: selectedVariant?.name,
            quantity,
            image: getImage(),
        }

        addProuctToCart(cartProduct)

        // show confirmation toast
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)

        setPosted(false)
        setQuantity(1)
        // leave selectedVariant as-is
    }


    return (
        <>
            
            


            {/* Selector de Cantidad */}
            {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                    <label className="block mb-1">Variante</label>
                    <select
                        className="border rounded p-2 w-full"
                        value={selectedVariantId}
                        onChange={e => setSelectedVariantId(e.target.value)}
                    >
                        {product.variants.map(v => (
                            <option key={v.id} value={v.id}>{v.name} {v.price ? ` - $${v.price}` : ''}</option>
                        ))}
                    </select>
                </div>
            )}

            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />


            {/* Button */}
            <button onClick={addToCart} className="btn-primary my-5" disabled={posted}>
                {posted ? 'Agregando...' : 'Agregar al carrito'}
            </button>

            {/* simple inline notification */}
            {showNotification && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed right-6 bottom-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50"
                >
                     Producto agregado
                </div>
            )}


        </>
    )
}
