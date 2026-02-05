import React from 'react'
import { ProductGrid } from '@/components/products/product-grid/ProductGrid';
import { getAllProductsAction } from '@/lib/actions/product/product.actions';
import { Title } from '@/components/ui/Title';

export const ProductsServer = async () => {
    const products = await getAllProductsAction();
    return (
        <>
            <Title title="Productos" size="4xl" className="ml-1 mt-5 mb-3"/>
            <ProductGrid products={products} />
        </>
  )
}
