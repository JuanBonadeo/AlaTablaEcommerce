'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ProductImage } from 'src/components/product/prduct-image/ProductImage';
import { Product } from 'src/shared/types/types';

interface Props {
  product: Product
}


export const ProductGridItem = ( { product }: Props ) => {

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