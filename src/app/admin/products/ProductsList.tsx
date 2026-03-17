'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { deleteProductAction } from '@/lib/actions/product/product.actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { currencyFormat } from '@/lib/helpers/currencyFormat';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category?: {
    id: string;
    name: string;
  };
  images?: Array<{ url: string }>;
  offer?: {
    id: string;
    descuento: number;
    descripcion: string | null;
  } | null;
};

type Category = {
  id: string;
  name: string;
};

interface ProductsListProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsList({ initialProducts, categories }: ProductsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">Sin Stock</span>;
    }
    if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">Stock Bajo</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Disponible</span>;
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    const result = await deleteProductAction(deletingId);
    setIsDeleting(false);
    setDeleteModalOpen(false);
    if (result.ok) {
      setProducts(prev => prev.filter(p => p.id !== deletingId));
      setDeletingId(null);
      setDeletingName('');
    } else {
      // Optional: surface error UI
      console.error(result.message || 'Error al eliminar el producto');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-cyan-500/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1 sm:mb-2">Productos</h1>
          <p className="text-sm sm:text-base text-slate-400">Gestiona tu catálogo de productos</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 font-medium text-white shadow-[0_12px_20px_-16px_rgba(251,146,60,0.95)] transition-transform hover:scale-[1.02] whitespace-nowrap"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nuevo Producto</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Total Productos</span>
            <Package size={16} className="text-blue-500" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-100">{initialProducts.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Activos</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-100">{initialProducts.filter(p => p.stock > 0).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Stock Bajo</span>
            <AlertCircle size={16} className="text-yellow-500" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-100">{initialProducts.filter(p => p.stock > 0 && p.stock < 10).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Sin Stock</span>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-100">{initialProducts.filter(p => p.stock === 0).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 py-2 pl-10 pr-4 text-slate-200 placeholder-slate-500 transition-colors focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-slate-200 transition-colors focus:outline-none focus:border-orange-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-slate-300 transition-colors hover:border-slate-600">
              <Filter size={18} />
              Más filtros
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111a21]/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800 bg-slate-900/70">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Producto</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Categoría</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Precio</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Estado</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-900/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                            <Package size={24} className="text-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-300">{product.category?.name || '-'}</span>
                  </td>
                  <td className="py-4 px-6">
                    {product.offer ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-orange-500">{currencyFormat(product.price * (1 - product.offer.descuento / 100))}</span>
                          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">-{product.offer.descuento}%</span>
                        </div>
                        <span className="text-xs text-slate-500 line-through">{currencyFormat(product.price)}</span>
                      </div>
                    ) : (
                      <span className="font-medium text-slate-100">{currencyFormat(product.price)}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : 'text-gray-300'}`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(product.stock)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/productos/${product.slug}`}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Ver detalles"
                        target="_blank"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(product.id, product.name)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 mb-2">No se encontraron productos</p>
            <p className="text-sm text-slate-500">Intenta con otros filtros o crea un nuevo producto</p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Mostrando <span className="font-medium text-slate-100">{filteredProducts.length}</span> de{' '}
              <span className="font-medium text-slate-100">{initialProducts.length}</span> productos
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded border border-slate-700 bg-slate-900/70 text-slate-400 transition-colors hover:border-slate-600 disabled:opacity-50" disabled>
                Anterior
              </button>
              <button className="px-3 py-1 bg-orange-500 text-white rounded font-medium">1</button>
              <button className="px-3 py-1 rounded border border-slate-700 bg-slate-900/70 text-slate-400 transition-colors hover:border-slate-600">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        open={deleteModalOpen}
        title="Eliminar producto"
        message={`¿Estás seguro de eliminar "${deletingName}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
