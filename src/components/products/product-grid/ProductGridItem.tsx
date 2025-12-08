'use client';
import { ProductGridItem } from '@/lib/types/product.types.js';
import Link from 'next/link';
import { useState } from 'react';
import { ProductImage } from '../../product/prduct-image/ProductImage';
import { calculatePrice, formatPrice } from '@/lib/utils/pricing';

interface Props {
  product: ProductGridItem
}


export const ProductGridItemComponent = ( { product }: Props ) => {

  const [ displayImage, setDisplayImage ] = useState( product?.images[0].url  );
  
  // Calcular precio con oferta
  const activeOffer = product.offers?.[0] || null;
  const priceInfo = calculatePrice(product.price, activeOffer);

  return (
    <div className="rounded-md overflow-hidden fade-in relative">
      <Link href={ `/productos/${ product.slug }` }>
        {/* Badge de descuento */}
        {priceInfo.hasOffer && priceInfo.discount && (
          <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{priceInfo.discount}%
          </div>
        )}
        
        <ProductImage
          src={ displayImage }
          alt={ product.name }
          className="w-full object-cover rounded"
          width={ 500 }
          height={ 500 }
          onMouseEnter={ () => setDisplayImage( product?.images[1]?.url )  }
          onMouseLeave={ () => setDisplayImage( product?.images[0]?.url ) }
        />
      </Link>

      <div className="p-4 flex flex-col">
        <Link
          className="hover:text-blue-600"
          href={ `/productos/${ product.slug }` }>
          { product.name }
        </Link>
        
        {/* Mostrar precio original tachado si hay oferta */}
        {priceInfo.hasOffer ? (
          <div className="flex justify-between items-center gap-1">
            <span className="text-gray-500 line-through text-sm">
              ${formatPrice(priceInfo.originalPrice)}
            </span>
            <span className="font-bold text-lg text-orange-500 flex flex-col  items-center">
              ${formatPrice(priceInfo.finalPrice)}
              {activeOffer?.descripcion && (
              <span className="text-xs text-gray-400 italic">
                {activeOffer.descripcion}
              </span>
            )}
            </span>
            
          </div>
        ) : (
          <span className="font-bold">${formatPrice(product.price)}</span>
        )}
      </div>

    </div>
  );
};