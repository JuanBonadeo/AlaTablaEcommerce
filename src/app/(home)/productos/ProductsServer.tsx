import React from 'react'
import { ProductGrid } from '@/components/products/product-grid/ProductGrid';
import { getAllProductsAction } from '@/lib/actions/product/product.actions';

export const ProductsServer = async () => {
    const products = await getAllProductsAction();
    return (
        <>
            <ProductGrid products={products} />
        </>
  )
}
