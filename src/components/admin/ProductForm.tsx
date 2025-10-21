'use client';

import { createProductAction, updateProductAction } from '@/lib/actions/product.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Product, ProductVariant } from '@/lib/types/product.types';
import { Category } from '@/lib/types/categories.types';
interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para imágenes (URLs separadas por comas)
  const [imagesInput, setImagesInput] = useState(
    product?.images?.map((img) => img.url).join(', ') || ''
  );

  // Estado para variantes
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Agregar imágenes y variantes al FormData
    formData.set('images', imagesInput);
    formData.set('variants', JSON.stringify(variants));

    try {
      const result = product
        ? await updateProductAction(product.id, formData)
        : await createProductAction(formData);

      if (result.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(result.message || 'Error al guardar el producto');
      }
    } catch (err) {
      setError('Error inesperado al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: undefined, stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  return (
    <form onSubmit={handleSubmit} className="bg rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium  mb-1">
          Nombre del producto *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={product?.name}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium  mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ''}
          
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Precio y Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium  mb-1">
            Precio *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            defaultValue={product?.price}
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium  mb-1">
            Stock *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            defaultValue={product?.stock || 0}
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium  mb-1">
          Categoría *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Imágenes */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium  mb-1">
          URLs de imágenes (separadas por comas)
        </label>
        <textarea
          id="images"
          value={imagesInput}
          onChange={(e) => setImagesInput(e.target.value)}
          placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Por ahora ingresa URLs directas. Cloudinary se integrará próximamente.
        </p>
      </div>

      {/* Variantes */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium ">Variantes (opcional)</h3>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm bg-gray-800 hover:bg-gray-200  px-3 py-1 rounded"
          >
            + Agregar variante
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="Ej: Mango de madera"
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Precio extra</label>
                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) =>
                        updateVariant(index, 'price', e.target.value ? Number(e.target.value) : undefined)
                      }
                      step="0.01"
                      placeholder="Opcional"
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Stock</label>
                    <input
                      type="number"
                      value={variant.stock || 0}
                      onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                      min="0"
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-600 hover:text-red-800 text-sm mt-5"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Guardando...' : product ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}