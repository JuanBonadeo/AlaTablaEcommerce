'use client';

import { deleteCategoryAction } from '@/lib/actions/category/category.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string, productCount?: number) => {
    if (productCount && productCount > 0) {
      alert(`No se puede eliminar "${name}" porque tiene ${productCount} producto(s) asociado(s)`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) return;

    setDeletingId(id);
    const result = await deleteCategoryAction(id);
    
    if (result.ok) {
      router.refresh();
    } else {
      alert(result.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="bg rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-800 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-stone-900">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium ">
                    {category.name}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {category._count?.products || 0} productos
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(
                      category.id, 
                      category.name,
                      category._count?.products
                    )}
                    disabled={deletingId === category.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deletingId === category.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}