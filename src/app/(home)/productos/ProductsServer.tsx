import React from 'react'
import { ProductGrid } from '@/components/products/product-grid/ProductGrid';
import { getAllProductsAction } from '@/lib/actions/product/product.actions';
import { Title } from '@/components/ui/Title';
import { serializeDates } from '@/lib/utils/obj-utils';

export const ProductsServer = async () => {
    const products = await getAllProductsAction();
    const serializedProducts = serializeDates(products);
    
    return (
        <>
            <Title title="Productos" size="4xl" className="ml-1 mt-5 mb-3"/>
            <ProductGrid products={serializedProducts} />
        </>
  )
}
