'use client'

import { useCartStore } from "@/lib/store/cart-stores"
import { useEffect, useState } from "react"
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { ProductImage } from "@/components/product/prduct-image/ProductImage";
import { calculatePrice } from "@/lib/utils/pricing";
import { ProductsInCartSkeleton } from "@/components/ui/skeletons/ProductsInCartSkeleton";

export const ProductsIncart = () => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])


    const productsInCart = useCartStore(state => state.cart)
    if (!loaded) {
        return <ProductsInCartSkeleton />
    }
    return (
        <>
            {
                productsInCart.map(product => {
                    const priceInfo = calculatePrice(product.price, product.offer)
                    const itemTotal = priceInfo.finalPrice * product.quantity
                    
                    return (
                    <div key={`${product.slug}-${product.variantId}`} className="flex mb-5 fade-in">
                        <ProductImage
                            src={product.image}
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
                            <span className="hover:underline ">
                                <p>{product.variantId} - {product.name} ({product.quantity})</p>
                            </span>

                            {priceInfo.hasOffer ? (
                                <div className="mt-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded">
                                            OFERTA
                                        </span>
                                        <span className="text-xs bg-linear-gradient(to right, rgb(249 115 22), rgb(234 88 12))-500 text-white px-2 py-0.5 rounded">
                                            -{priceInfo.discount}% OFF
                                        </span>
                                    </div>
                                    {product.offer?.descripcion && (
                                        <p className="text-xs text-gray-600 mb-1 italic">
                                            {product.offer.descripcion}
                                        </p>
                                    )}
                                    <p className="font-bold text-linear-gradient(to right, rgb(249 115 22), rgb(234 88 12))-600">{currencyFormat(itemTotal)}</p>
                                </div>
                            ) : (
                                <p className="font-bold">{currencyFormat(itemTotal)}</p>
                            )}

                        </div>

                    </div>
                    )
                })
            }


        </>
    )
}
