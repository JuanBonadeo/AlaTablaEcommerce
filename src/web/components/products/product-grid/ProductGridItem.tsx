'use client';
import { ProductGridItem } from '@/lib/types/product.types.js';
import Link from 'next/link';
import { useState } from 'react';
import { ProductImage } from '../../product/prduct-image/ProductImage';

interface Props {
  product: ProductGridItem
}


export const ProductGridItemComponent = ( { product }: Props ) => {

  const [ displayImage, setDisplayImage ] = useState( product?.images[0].url );

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={ `/productos/${ product.slug }` }>
        <ProductImage
          src={  displayImage  }
          alt={ product.name }
          className="w-full object-cover rounded"
          width={ 500 }
          height={ 500 }
          onMouseEnter={ () => setDisplayImage( product?.images[1].url )  }
          onMouseLeave={ () => setDisplayImage( product?.images[0].url ) }
        />
      </Link>

      <div className="p-4 flex flex-col">
        <Link
          className="hover:text-blue-600"
          href={ `/product/${ product.slug }` }>
          { product.name }
        </Link>
        <span className="font-bold">${ product.price }</span>
      </div>

    </div>
  );
};