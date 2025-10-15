'use client'

import { QuantitySelector } from "@/components"
import { ProductImage } from "@/components/product/prduct-image/ProductImage"
import { useCartStore } from "@/store/cart/cart-stores"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export const ProductsIncart = () => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
    const removeProduct = useCartStore(state => state.removeProduct)

    const productsInCart = useCartStore(state => state.cart)
    if (!loaded) {
        return <p>Cargando...</p>
    }
    return (
        <>
            {
                productsInCart.map(product => (

                    <div key={`${product.slug}-${product.size}`} className="flex mb-5 fade-in">
                        <ProductImage
                            src={ product.image }
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            alt={product.title}
                            className="mr-5 rounded"
                        />

                        <div>
                            <Link href={`product/${product.slug}`} className="hover:underline cursor-pointer">
                                <p>{product.size} - {product.title}</p>
                            </Link>

                            <p>${product.price}</p>

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


                ))
            }


        </>
    )
}
