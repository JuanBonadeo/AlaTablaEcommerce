import { CategoryForm } from '@/components/admin/CategoryForm';
import { getCategoryByIdAction } from '@/lib/actions/category/category.actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategoryByIdAction(params.id);

  if (!category) {
    notFound();
  }

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

      <h1 className="text-3xl font-bold mb-8">Editar Categoría</h1>

      <CategoryForm category={category} />
    </div>
  );
}