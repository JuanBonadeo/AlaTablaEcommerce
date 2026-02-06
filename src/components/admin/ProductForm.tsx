'use client';

import { createProductAction, updateProductAction } from '@/lib/actions/product/product.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Product, ProductVariant } from '@/lib/types/product.types';
import { Category } from '@/lib/types/categories.types';
import { ProductImage } from '../product/prduct-image/ProductImage';
import { deleteProductImage } from '@/lib/actions/images/delete-product-image';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  // existingImages holds images that are already saved in DB for this product
  const [existingImages, setExistingImages] = useState(
    (product?.images || [])
      .filter((i): i is { id: string; url: string; productId: string } => typeof i !== 'string')
  );

  // Estado para variantes
  const [variants, setVariants] = useState<ProductVariant[]>(
    (product?.variants || []).map(v => ({
      ...v,
      price: v.price ?? undefined,
      stock: v.stock ?? undefined,
    }))
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

    // Convertir imágenes a base64 Data URL para conservar el MIME
    const base64Images: string[] = [];
    for (const image of selectedImages) {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Error leyendo la imagen'));
        reader.readAsDataURL(image);
      });
      base64Images.push(dataUrl);
    }

    // Combine existing image URLs (that remain) with new base64 images
    const existingUrls = existingImages.map((i) => i.url);
    const imagesPayload = [...existingUrls, ...base64Images];
    // Agregar imágenes base64 y variantes al FormData
    formData.set('images', JSON.stringify(imagesPayload));
    if (variants && variants.length > 0) {
      formData.set('variants', JSON.stringify(variants));
    }
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
      setError('Error inesperado al guardar el producto ' + (err instanceof Error ? err.message : ''));
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

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number | undefined) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const [deleteImageModalOpen, setDeleteImageModalOpen] = useState(false);
  const [imagePendingDelete, setImagePendingDelete] = useState<{ id: string; url: string } | null>(null);
  const [deletingImage, setDeletingImage] = useState(false);

  const openDeleteImageModal = (imageId: string, imageUrl: string) => {
    setImagePendingDelete({ id: imageId, url: imageUrl });
    setDeleteImageModalOpen(true);
  };

  const confirmDeleteImage = async () => {
    if (!imagePendingDelete) return;
    setDeletingImage(true);
    try {
      const result = await deleteProductImage(imagePendingDelete.id, imagePendingDelete.url, product?.slug ?? '');
      if (result?.ok) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imagePendingDelete.id));
      } else {
        setError(result?.message || 'No se pudo eliminar la imagen');
      }
    } catch (err) {
      setError('Error al eliminar la imagen' + (err instanceof Error ? err.message : ''));
    } finally {
      setDeletingImage(false);
      setDeleteImageModalOpen(false);
      setImagePendingDelete(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg rounded-lg shadow p-3 sm:p-6 space-y-4 sm:space-y-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium  mb-1">
            Precio Venta *
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
          <label htmlFor="costPrice" className="block text-sm font-medium  mb-1">
            Costo (Proveedor)
          </label>
          <input
            type="number"
            id="costPrice"
            name="costPrice"
            defaultValue={product?.costPrice || 0}
            step="0.01"
            min="0"
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
      <div className="flex flex-col mb-2 w-md text-bl">
        <label className="block text-sm font-medium mb-1">Fotos</label>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="btn-secondary"
          accept="image/png, image/jpeg, image/avif"
        />
        {selectedImages.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {selectedImages.length} imagen(es) seleccionada(s)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {existingImages.map((image) => (
          <div key={image.id}>
            <ProductImage
              alt={product?.name ?? ""}
              src={image.url}
              width={300}
              height={300}
              className="rounded-t shadow-md"
            />

            <button
              type="button"
              onClick={() => openDeleteImageModal(image.id, image.url)}
              className="btn-primary w-full rounded-b-xl"
            >
              Eliminar
            </button>
          </div>
        ))}
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
            <div key={index} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    <label className="block text-xs text-gray-600 mb-1">Costo (Prov)</label>
                    <input
                      type="number"
                      value={variant.costPrice || ''}
                      onChange={(e) =>
                        updateVariant(index, 'costPrice', e.target.value ? Number(e.target.value) : 0)
                      }
                      step="0.01"
                      placeholder="0.00"
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
                  className="text-red-600 hover:text-red-800 text-sm sm:mt-5 self-end sm:self-start"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
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
      <ConfirmModal
        open={deleteImageModalOpen}
        title="Eliminar imagen"
        message={"¿Estás seguro de eliminar esta imagen?"}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deletingImage}
        onConfirm={confirmDeleteImage}
        onCancel={() => setDeleteImageModalOpen(false)}
      />
    </form >
  );
}