import { getProductByIdAction, getAllCategoriesAction } from '@/lib/actions/product/product.actions';
import { notFound } from 'next/navigation';
import EditProductClient from './EditProductClient';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    getProductByIdAction(params.id),
    getAllCategoriesAction(),
  ]);

  if (!product) {
    notFound();
  }

  return <EditProductClient product={product} categories={categories} />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('images', JSON.stringify(images));
    formDataToSend.append('variants', JSON.stringify(variants));

    startTransition(async () => {
      const result = await updateProductAction(product.id, formDataToSend);
      
      if (result.ok) {
        alert('Producto actualizado exitosamente');
        router.push('/admin/products');
      } else {
        alert(result.message || 'Error al actualizar el producto');
      }
    });
  };

  const handleDelete = async () => {
    if (!product) return;
    
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;

    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      
      if (result.ok) {
        alert('Producto eliminado exitosamente');
        router.push('/admin/products');
      } else {
        alert(result.message || 'Error al eliminar el producto');
      }
    });
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', stock: '', slug: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Producto no encontrado</div>
      </div>
    );
  }

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
            <p className="text-gray-400">ID: {product.id}</p>
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
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Información Básica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Imágenes del Producto</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden">
                      <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="aspect-square bg-[#0a0a0a] border-2 border-dashed border-gray-800 hover:border-orange-500 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload size={24} className="text-gray-500" />
                  <span className="text-sm text-gray-500">Subir imagen</span>
                </button>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Variantes</h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-400 text-sm font-medium"
              >
                <Plus size={18} />
                Agregar Variante
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-white">
                      {variant.id ? `Variante #${variant.id}` : `Nueva Variante`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Nombre</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].name = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="w-full bg-[#171718] border border-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Precio</label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].price = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="w-full bg-[#171718] border border-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Stock</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].stock = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="w-full bg-[#171718] border border-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                      />
                    </div>
                  </div>
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
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Categoría</h2>
            <div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#171718] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Estado</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-800 bg-[#0a0a0a] text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                  defaultChecked
                />
                <span className="text-gray-300">Producto publicado</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-800 bg-[#0a0a0a] text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                />
                <span className="text-gray-300">Producto destacado</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#171718] border border-red-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Zona Peligrosa</h2>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={18} />
              Eliminar Producto
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
