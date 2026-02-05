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
        <div className="space-y-3 sm:space-y-4">
            {
                productsInCart.map(product => {
                    const priceInfo = calculatePrice(product.price, product.offer)

                    return (
                        <div
                            key={`${product.slug}-${product.variantId ?? 'novar'}`}
                            className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl p-3 sm:p-4 fade-in transition-all border border-gray-800/50 hover:border-orange-500/30 shadow-lg"
                        >
                            <div className="flex gap-3 sm:gap-4">
                                {/* Product Image */}
                                <div className="relative flex-shrink-0">
                                    <Link href={`productos/${product.slug}`}>
                                        <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-gray-800/50 shadow-inner">
                                            <ProductImage
                                                src={product.image}
                                                width={120}
                                                height={120}
                                                style={{
                                                    width: '90px',
                                                    height: '90px'
                                                }}
                                                alt={product.name}
                                                className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </Link>

                                    {/* Offer Badge */}
                                    {priceInfo.hasOffer && (
                                        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-orange-500 to-orange-600 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg shadow-orange-500/50 animate-pulse">
                                            -{priceInfo.discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <Link
                                            href={`productos/${product.slug}`}
                                            className="hover:text-orange-400 transition-colors font-semibold text-white text-sm sm:text-base line-clamp-2 leading-tight"
                                        >
                                            {product.name}
                                        </Link>

                                        {product.variantName && (
                                            <div className="mt-1 inline-flex items-center gap-1 bg-gray-800/50 px-2 py-0.5 rounded-md">
                                                <Tag size={10} className="text-orange-400" />
                                                <span className="text-[10px] sm:text-xs text-gray-300">{product.variantName}</span>
                                            </div>
                                        )}

                                        {/* Pricing */}
                                        {priceInfo.hasOffer ? (
                                            <div className="mt-2">
                                                {product.offer?.descripcion && (
                                                    <p className="text-[10px] text-gray-500 mb-1 italic line-clamp-1">
                                                        {product.offer.descripcion}
                                                    </p>
                                                )}
                                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                                    <span className="text-gray-500 line-through text-xs">
                                                        {formatPrice(priceInfo.originalPrice)}
                                                    </span>
                                                    <span className="font-bold text-orange-500 text-base sm:text-lg">
                                                        {formatPrice(priceInfo.finalPrice)}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-green-400 font-medium mt-0.5">
                                                    Ahorrás {formatPrice(priceInfo.savings || 0)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="font-bold text-orange-400 text-base sm:text-lg mt-2">
                                                {formatPrice(product.price)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50 gap-2">
                                        <QuantitySelector
                                            quantity={product.quantity}
                                            onQuantityChanged={value => updateProductQuantity(product, value)}
                                        />

                                        <button
                                            className="flex items-center justify-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-medium px-2 py-1.5 rounded-lg"
                                            onClick={() => removeProduct(product)}
                                        >
                                            <Trash2 size={14} />
                                            <span className="hidden xs:inline sm:hidden md:inline">Eliminar</span>
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
