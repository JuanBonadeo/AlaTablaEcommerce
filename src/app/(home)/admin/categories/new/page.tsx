import { CategoryForm } from '@/components/admin/CategoryForm';
import Link from 'next/link';

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Volver a categorías
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Crear Nueva Categoría</h1>

      <CategoryForm />
    </div>
  );
}