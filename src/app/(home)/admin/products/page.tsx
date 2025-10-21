import { getAllProductsAction } from '@/lib/actions/product.actions';
import { ProductsTable } from '@/components/admin/ProductsTable';
import Link from 'next/link';
import { Product } from '@/lib/types/product.types';

export default async function AdminProductsPage() {
  const products: Product[] = await getAllProductsAction();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Administrar Productos</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      {products && products.length > 0 ? (
        <ProductsTable products={products} />     
      ) : (
        <div className="bg rounded-lg p-12 text-center">
          <p className="text-gray-300 mb-4">No hay productos creados</p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Crear primer producto
          </Link>
        </div>
      )}
    </div>
  );
}