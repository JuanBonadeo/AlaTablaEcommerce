'use client'

import { useCartStore } from "@/lib/store/cart-stores"
import { useEffect, useState } from "react"
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { ProductImage } from "@/components/product/prduct-image/ProductImage";

export const ProductsIncart = () => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])


    const productsInCart = useCartStore(state => state.cart)
    if (!loaded) {
        return <p>Cargando...</p>
    }
    return (
        <>
            {
                productsInCart.map(product => (

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

                            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>

                        </div>

                    </div>


                ))
            }


        </>
    )
}
