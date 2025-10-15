'use client'



import { useState } from "react";
import { QuantitySelector } from "../quantity-selector/QuantitySelector";
import { Product } from "src/shared/types/shared.types";




interface Props {
    product: Product;
}
export const AddToCart = ({ product }: Props) => {

    // const addProuctToCart = useCartStore( state => state.addProductToCart);

    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState(false)

    // const addToCart = () => {
    //     setPosted(true)
        
    //     if(!size ) return

    //     const cartProduct: CartProduct = {
    //         id: product.id,
    //         slug: product.slug,
    //         title: product.title,
    //         price: product.price,
    //         image: product.images[0],
    //         quantity,
    //         size
    //     }

    //     addProuctToCart( cartProduct )
    //     setPosted(false)
    //     setQuantity(1)
    //     setSize(undefined)

    // }


    return (
        <>
            
            


            {/* Selector de Cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />


            {/* Button */}
            <button  onClick={  () => {}}className="btn-primary my-5">
                Agregar al carrito
            </button>


        </>
    )
}
