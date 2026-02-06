'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Tag, X, Save } from 'lucide-react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/lib/actions/category/category.actions';
import type { Category } from '@/lib/types/categories.types';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface CategoriesClientProps {
  categories: Category[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);

    try {
      const result = editingCategory
        ? await updateCategoryAction(editingCategory.id, data)
        : await createCategoryAction(data);

      if (result.ok) {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '' });
        router.refresh();
      } else {
        setError(result.message || 'Error al guardar la categoría');
      }
    } catch (err) {
      setError('Error inesperado al guardar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmMessage('¿Estás seguro de eliminar esta categoría?');
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleNew = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setError(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Categorías</h1>
          <p className="text-sm sm:text-base text-gray-400">{categories.length} categorías en total</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nueva Categoría</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-[#171718] border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Tag className="text-orange-400" size={24} />
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={isSubmitting}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-white font-bold text-lg">{category.name}</h3>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Tag className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No hay categorías creadas</p>
            <button
              onClick={handleNew}
              className="mt-4 text-orange-400 hover:text-orange-300 transition-colors"
            >
              Crear la primera categoría
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171718] border border-gray-800 rounded-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Tag className="text-orange-400" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  required
                  placeholder="Ej: Cuchillos"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save size={18} />
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        open={confirmOpen}
        title="Eliminar categoría"
        message={confirmMessage}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={isSubmitting}
        onConfirm={async () => {
          if (!pendingDeleteId) return;
          setIsSubmitting(true);
          try {
            const result = await deleteCategoryAction(pendingDeleteId);
            if (result.ok) {
              router.refresh();
            } else {
              alert(result.message);
            }
          } catch (error) {
            alert('Error al eliminar la categoría');
          } finally {
            setIsSubmitting(false);
            setConfirmOpen(false);
            setPendingDeleteId(null);
          }
        }}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </div>
  );
}
