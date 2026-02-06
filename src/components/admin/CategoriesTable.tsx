'use client';

import { deleteCategoryAction } from '@/lib/actions/category/category.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string, productCount?: number) => {
    if (productCount && productCount > 0) {
      alert(`No se puede eliminar "${name}" porque tiene ${productCount} producto(s) asociado(s)`);
      return;
    }
    setConfirmMessage(`¿Estás seguro de eliminar la categoría "${name}"?`);
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg rounded-lg shadow overflow-hidden">
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="bg-[#171718] rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-200">{category.name}</h3>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                {category._count?.products || 0}
              </span>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-800">
              <Link
                href={`/admin/categories/${category.id}`}
                className="flex-1 text-center text-xs text-blue-600 hover:text-blue-900 font-medium py-2 px-3 rounded bg-blue-50"
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
                className="flex-1 text-xs text-red-600 hover:text-red-900 disabled:opacity-50 font-medium py-2 px-3 rounded bg-red-50"
              >
                {deletingId === category.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar categoría"
        message={confirmMessage}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deletingId !== null}
        onConfirm={async () => {
          if (!pendingDeleteId) return;
          setDeletingId(pendingDeleteId);
          const result = await deleteCategoryAction(pendingDeleteId);
          setDeletingId(null);
          setConfirmOpen(false);
          setPendingDeleteId(null);
          if (result.ok) {
            router.refresh();
          } else {
            alert(result.message);
          }
        }}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </>
  );
}