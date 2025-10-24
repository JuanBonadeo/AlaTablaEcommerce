import { ProductForm } from '@/components/admin/ProductForm';
import { getProductByIdAction, getAllCategoriesAction, getProductBySlugAction } from '@/lib/actions/product/product.actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    getProductByIdAction(params.id),
    getAllCategoriesAction(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Volver a productos
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Editar Producto</h1>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}