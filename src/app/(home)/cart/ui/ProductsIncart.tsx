'use client'

import { QuantitySelector } from "@/components/product/quantity-selector/QuantitySelector"
import { ProductImage } from "@/components/product/prduct-image/ProductImage"
import { useCartStore } from "@/lib/store/cart-stores"
import Link from "next/link"
import { useEffect, useState } from "react"
import { calculatePrice, formatPrice } from "@/lib/utils/pricing"
import { ProductsInCartSkeleton } from "@/components/ui/skeletons/ProductsInCartSkeleton"

export const ProductsIncart = () => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
    const removeProduct = useCartStore(state => state.removeProduct)

    const productsInCart = useCartStore(state => state.cart)
    if (!loaded) {
        return <ProductsInCartSkeleton />
    }
    return (
        <>
            {
                productsInCart.map(product => {
                    const priceInfo = calculatePrice(product.price, product.offer)
                    
                    return (
                    <div key={`${product.slug}-${product.variantId ?? 'novar'}`} className="flex mb-5 fade-in">
                        <ProductImage
                            src={ product.image }
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            alt={product.name}
                            className="mr-5 rounded"
                        />

                        <div>
                            <Link href={`productos/${product.slug}`} className="hover:underline cursor-pointer">
                                <p>{product.variantName ?? ''} - {product.name}</p>
                            </Link>

                            {priceInfo.hasOffer ? (
                                <div className="mt-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded">
                                            OFERTA
                                        </span>
                                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                                            -{priceInfo.discount}% OFF
                                        </span>
                                    </div>
                                    {product.offer?.descripcion && (
                                        <p className="text-xs text-gray-600 mb-1 italic">
                                            {product.offer.descripcion}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 line-through text-sm">
                                            ${formatPrice(priceInfo.originalPrice)}
                                        </span>
                                        <span className="font-bold text-orange-600 text-lg">
                                            ${formatPrice(priceInfo.finalPrice)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-600 font-medium">
                                        Ahorrás ${formatPrice(priceInfo.savings || 0)}
                                    </p>
                                </div>
                            ) : (
                                <p className="font-bold mt-1">${formatPrice(product.price)}</p>
                            )}

                            <QuantitySelector
                                quantity={product.quantity}
                                onQuantityChanged={value => updateProductQuantity(product, value)}
                            />


                            <button
                                className="underline mt-3"
                                onClick={ () => removeProduct(product)}
                            >
                                Remover
                            </button>
                        </div>

                    </div>
                    )
                })
            }


        </>
    )
}
