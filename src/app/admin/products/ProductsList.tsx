'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, AlertCircle } from 'lucide-react';
import Image from 'next/image';

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

  const filteredProducts = initialProducts.filter(product => {
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    // TODO: Implement delete with server action
    console.log('Delete product:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Productos</h1>
          <p className="text-gray-400">Gestiona tu catálogo de productos</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Productos</span>
            <Package size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">{initialProducts.length}</p>
        </div>
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Activos</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-white">{initialProducts.filter(p => p.stock > 0).length}</p>
        </div>
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Stock Bajo</span>
            <AlertCircle size={18} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white">{initialProducts.filter(p => p.stock > 0 && p.stock < 10).length}</p>
        </div>
        <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Sin Stock</span>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-white">{initialProducts.filter(p => p.stock === 0).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors">
              <Filter size={18} />
              Más filtros
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Producto</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Categoría</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Precio</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Estado</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0].url} 
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package size={24} className="text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300">{product.category?.name || '-'}</span>
                  </td>
                  <td className="py-4 px-6">
                    {product.offer ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-orange-500">${(product.price * (1 - product.offer.descuento / 100)).toFixed(2)}</span>
                          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">-{product.offer.descuento}%</span>
                        </div>
                        <span className="text-xs text-gray-500 line-through">${product.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="font-medium text-white">${product.price.toLocaleString()}</span>
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
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Ver detalles"
                        target="_blank"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 mb-2">No se encontraron productos</p>
            <p className="text-sm text-gray-500">Intenta con otros filtros o crea un nuevo producto</p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Mostrando <span className="font-medium text-white">{filteredProducts.length}</span> de{' '}
              <span className="font-medium text-white">{initialProducts.length}</span> productos
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-[#0a0a0a] border border-gray-800 text-gray-400 rounded hover:border-gray-700 transition-colors disabled:opacity-50" disabled>
                Anterior
              </button>
              <button className="px-3 py-1 bg-orange-500 text-white rounded font-medium">1</button>
              <button className="px-3 py-1 bg-[#0a0a0a] border border-gray-800 text-gray-400 rounded hover:border-gray-700 transition-colors">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
