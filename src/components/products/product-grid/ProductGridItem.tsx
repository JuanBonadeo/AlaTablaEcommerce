'use client';
import { ProductGridItem } from '@/lib/types/product.types.js';
import Link from 'next/link';
import { useState } from 'react';
import { ProductImage } from '../../product/prduct-image/ProductImage';
import { calculatePrice, formatPrice } from '@/lib/utils/pricing';
import { useCartStore } from '@/lib/store/cart-stores';
import { Plus } from 'lucide-react';
import { ToastNotification } from '@/components/ui/ToastNotification';

interface Props {
  product: ProductGridItem
}


export const ProductGridItemComponent = ({ product }: Props) => {

  const [displayImage, setDisplayImage] = useState(product?.images[0].url);
  const [showNotification, setShowNotification] = useState(false);

  // Calcular precio con oferta
  const activeOffer = product.offers?.[0] || null;
  const priceInfo = calculatePrice(product.price, activeOffer);

  return (
    <div className="rounded-md overflow-hidden fade-in relative">
      <Link href={`/productos/${product.slug}`}>
        {/* Badge de descuento */}
        {priceInfo.hasOffer && priceInfo.discount && (
          <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{priceInfo.discount}%
          </div>
        )}

        <div className="relative group aspect-square overflow-hidden rounded">
          <ProductImage
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover"
            width={500}
            height={500}
            onMouseEnter={() => setDisplayImage(product?.images[1]?.url)}
            onMouseLeave={() => setDisplayImage(product?.images[0]?.url)}
          />
          {/* Quick Add Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
              useCartStore.getState().addProductToCart({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: priceInfo.finalPrice, // Use final price including offer
                image: product.images[0].url,
                quantity: 1,
                offer: product.activeOffer
              });
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 3000);
            }}
            className="absolute bottom-3 right-3 bg-orange-500 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600 hover:scale-110 z-20"
            title="Agregar al carrito"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col">
        <Link
          className="hover:text-orange-500 transition-colors font-medium text-gray-200"
          href={`/productos/${product.slug}`}>
          {product.name}
        </Link>

        {/* Mostrar precio original tachado si hay oferta */}
        {priceInfo.hasOffer ? (
          <div className="flex justify-between items-center gap-1 mt-1">
            <span className="text-gray-500 line-through text-xs">
              ${formatPrice(priceInfo.originalPrice)}
            </span>
            <span className="font-bold text-lg text-orange-500 flex items-center">
              ${formatPrice(priceInfo.finalPrice)}
            </span>

          </div>
        ) : (
          <span className="font-bold text-lg text-white mt-1">${formatPrice(product.price)}</span>
        )}
        {priceInfo.hasOffer && activeOffer?.descripcion && (
          <span className="text-xs text-gray-500 italic mt-0.5">
            {activeOffer.descripcion}
          </span>
        )}
      </div>

      <ToastNotification show={showNotification} />

    </div>
  );
};