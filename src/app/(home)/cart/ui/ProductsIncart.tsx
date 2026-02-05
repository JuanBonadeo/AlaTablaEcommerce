'use client'

import { QuantitySelector } from "@/components/product/quantity-selector/QuantitySelector"
import { ProductImage } from "@/components/product/prduct-image/ProductImage"
import { useCartStore } from "@/lib/store/cart-stores"
import Link from "next/link"
import { useEffect, useState } from "react"
import { calculatePrice, formatPrice } from "@/lib/utils/pricing"
import { ProductsInCartSkeleton } from "@/components/ui/skeletons/ProductsInCartSkeleton"
import { Trash2, Tag } from "lucide-react"

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
        <div className="space-y-4">
            {
                productsInCart.map(product => {
                    const priceInfo = calculatePrice(product.price, product.offer)

                    return (
                        <div
                            key={`${product.slug}-${product.variantId ?? 'novar'}`}
                            className="bg-[#171718] rounded-xl p-4 fade-in transition-all"
                        >
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="relative flex-shrink-0">
                                    <Link href={`productos/${product.slug}`}>
                                        <ProductImage
                                            src={product.image}
                                            width={120}
                                            height={120}
                                            style={{
                                                width: '120px',
                                                height: '120px'
                                            }}
                                            alt={product.name}
                                            className="rounded-lg object-cover hover:opacity-80 transition-opacity"
                                        />
                                    </Link>

                                    {/* Offer Badge */}
                                    {priceInfo.hasOffer && (
                                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                            -{priceInfo.discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <Link
                                            href={`productos/${product.slug}`}
                                            className="hover:text-orange-500 transition-colors font-medium text-white text-lg"
                                        >
                                            {product.name}
                                        </Link>

                                        {product.variantName && (
                                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                                <Tag size={14} />
                                                {product.variantName}
                                            </p>
                                        )}

                                        {/* Pricing */}
                                        {priceInfo.hasOffer ? (
                                            <div className="mt-3">
                                                {product.offer?.descripcion && (
                                                    <p className="text-xs text-gray-500 mb-2 italic">
                                                        {product.offer.descripcion}
                                                    </p>
                                                )}
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-gray-500 line-through text-sm">
                                                        ${formatPrice(priceInfo.originalPrice)}
                                                    </span>
                                                    <span className="font-bold text-orange-500 text-xl">
                                                        ${formatPrice(priceInfo.finalPrice)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-green-500 font-medium mt-1">
                                                    Ahorrás ${formatPrice(priceInfo.savings || 0)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="font-bold text-white text-xl mt-3">
                                                ${formatPrice(product.price)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                                        <QuantitySelector
                                            quantity={product.quantity}
                                            onQuantityChanged={value => updateProductQuantity(product, value)}
                                        />

                                        <button
                                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                                            onClick={() => removeProduct(product)}
                                        >
                                            <Trash2 size={16} />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
