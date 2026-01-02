import React from 'react';
import { ProductGrid } from '@/components/products/product-grid/ProductGrid';
import { getProductsByCategoryAction } from '@/lib/actions/product/product.actions';

interface Props {
  categoryName: string;
}

export const ProductsByCategoryServer = async ({ categoryName }: Props) => {
  const products = await getProductsByCategoryAction(categoryName);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No se encontraron productos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <>
      <ProductGrid products={products} />
    </>
  );
};
