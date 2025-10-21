import { ProductForm } from '@/components/admin/ProductForm';
import { getAllCategoriesAction } from '@/lib/actions/product.actions';
import Link from 'next/link';

export default async function NewProductPage() {
  const categories = await getAllCategoriesAction();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Volver a productos
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Crear Nuevo Producto</h1>

      <ProductForm categories={categories} />
    </div>
  );
}