import { getAllCategoriesAction } from '@/lib/actions/category.actions';
import { CategoriesTable } from '@/components/admin/CategoriesTable';
import Link from 'next/link';

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAction();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Administrar Categorías</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Categoría
        </Link>
      </div>

      {categories && categories.length > 0 ? (
        <CategoriesTable categories={categories} />
      ) : (
        <div className="bg rounded-lg p-12 text-center">
          <p className="text-gray-300 mb-4">No hay categorías creadas</p>
          <Link
            href="/admin/categories/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Crear primera categoría
          </Link>
        </div>
      )}
    </div>
  );
}