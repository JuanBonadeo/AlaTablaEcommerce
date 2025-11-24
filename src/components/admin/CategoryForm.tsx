'use client';

import { createCategoryAction, updateCategoryAction } from '@/lib/actions/category/category.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = category
        ? await updateCategoryAction(category.id, formData)
        : await createCategoryAction(formData);

      if (result.ok) {
        router.push('/admin/categories');
        router.refresh();
      } else {
        setError(result.message || 'Error al guardar la categoría');
      }
    } catch {
      setError('Error inesperado al guardar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la categoría *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={category?.name}
          required
          placeholder="Ej: Herramientas"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          El slug se generará automáticamente desde el nombre
        </p>
      </div>


      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Guardando...' : category ? 'Actualizar Categoría' : 'Crear Categoría'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}