'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import { updateProductAction, deleteProductAction } from '@/lib/actions/product/product.actions';
import { deleteProductImage } from '@/lib/actions/images/delete-product-image';
import type { Product } from '@/lib/types/product.types';
import type { Category } from '@/lib/types/categories.types';
import { ProductImage } from '@/components/product/prduct-image/ProductImage';

interface EditProductClientProps {
  product: Product;
  categories: Category[];
}

export default function EditProductClient({ product, categories }: EditProductClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(
    (product?.images || [])
      .filter((i): i is { id: string; url: string; productId: string } => typeof i !== 'string')
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Convertir imágenes a base64
    const base64Images: string[] = [];
    for (const image of selectedImages) {
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      base64Images.push(base64Image);
    }

    // Combinar URLs existentes con nuevas imágenes base64
    const existingUrls = existingImages.map((i) => i.url);
    const imagesPayload = [...existingUrls, ...base64Images];
    formData.set('images', JSON.stringify(imagesPayload));

    try {
      const result = await updateProductAction(product.id, formData);

      if (result.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(result.message || 'Error al actualizar el producto');
      }
    } catch (err) {
      setError('Error inesperado al actualizar el producto ' + (err instanceof Error ? err.message : ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;

    setIsSubmitting(true);
    try {
      const result = await deleteProductAction(product.id);

      if (result.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(result.message || 'Error al eliminar el producto');
      }
    } catch (err) {
      setError('Error al eliminar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta imagen?');
    if (!confirmed) return;

    try {
      const result = await deleteProductImage(imageId, imageUrl, product.slug);
      if (result?.ok) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        setError(result?.message || 'No se pudo eliminar la imagen');
      }
    } catch (err) {
      setError('Error al eliminar la imagen' + (err instanceof Error ? err.message : ''));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Editar Producto</h1>
            <p className="text-gray-400">{product.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 bg-[#171718] border border-gray-800 hover:border-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            <X size={18} />
            Cancelar
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Información Básica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={product.name}
                  required
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  defaultValue={product.description ?? ''}
                  rows={6}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Imágenes del Producto</h2>

            <div className="mb-4">
              <label className="flex items-center justify-center gap-3 bg-[#0a0a0a] border-2 border-dashed border-gray-700 hover:border-orange-500 rounded-lg px-6 py-8 cursor-pointer transition-colors group">
                <Upload className="text-gray-500 group-hover:text-orange-500" size={24} />
                <div className="text-center">
                  <p className="text-gray-300 font-medium mb-1">Haz clic para subir imágenes</p>
                  <p className="text-gray-500 text-sm">PNG, JPG, AVIF hasta 10MB</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/avif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {selectedImages.length > 0 && (
              <p className="text-sm text-gray-400 mb-4">
                {selectedImages.length} imagen(es) nueva(s) seleccionada(s)
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {existingImages.map((image) => (
                <div key={image.id} className="relative group">
                  <ProductImage
                    alt={product.name}
                    src={image.url}
                    width={300}
                    height={300}
                    className="rounded-t shadow-md w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id, image.url)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-b transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pricing & Stock */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Precio e Inventario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    defaultValue={product.price}
                    step="0.01"
                    min="0"
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={product.stock || 0}
                  min="0"
                  required
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>


          {/* Shipping Dimensions */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Envío (Opcional)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso (g)
                </label>
                <input
                  type="number"
                  name="weight"
                  defaultValue={product.weight || 0}
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Largo (cm)
                </label>
                <input
                  type="number"
                  name="length"
                  defaultValue={product.length || 0}
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ancho (cm)
                </label>
                <input
                  type="number"
                  name="width"
                  defaultValue={product.width || 0}
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alto (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  defaultValue={product.height || 0}
                  min="0"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Categoría</h2>
            <select
              name="categoryId"
              defaultValue={product.categoryId}
              required
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg font-medium transition-colors mb-3"
            >
              <Save size={18} />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#171718] border border-red-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Zona Peligrosa</h2>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={18} />
              Eliminar Producto
            </button>
          </div>
        </div>
      </form >
    </div >
  );
}
