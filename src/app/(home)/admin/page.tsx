import Link from 'next/link';
import { getAllProductsAction } from '@/lib/actions/product/product.actions';
import { getAllCategoriesAction } from '@/lib/actions/category/category.actions';
import { ClubIcon, GrabIcon, Home, PlusIcon, School2Icon, Square } from 'lucide-react';

export default async function AdminDashboard() {
    const [products, categories] = await Promise.all([
        getAllProductsAction(),
        getAllCategoriesAction(),
    ]);

    const stats = [
        {
            name: 'Total Productos',
            value: products.length,
            href: '/admin/products',
            icon: (
                <School2Icon className="w-8 h-8" />
            ),
            color: 'blue',
        },
        {
            name: 'Categorías',
            value: categories.length,
            href: '/admin/categories',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            color: 'green',
        },
        {
            name: 'Usuarios',
            value: 0,
            href: '/admin/users',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'purple',
        },
        {
            name: 'Stock Total',
            value: products.reduce((acc, p) => acc + p.stock, 0),
            href: '/admin/products',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'orange',
        },
    ];

    const quickActions = [
        {
            title: 'Crear Producto',
            description: 'Agregar un nuevo producto al catálogo',
            href: '/admin/products/new',
            icon: (
                <PlusIcon className="w-6 h-6" />
            ),
        },
        {
            title: 'Nueva Categoría',
            description: 'Crear una nueva categoría',
            href: '/admin/categories/new',
            icon: (
                <PlusIcon className="w-6 h-6" />
            ),
        },
        {
            title: 'Ver Productos',
            description: 'Administrar productos existentes',
            href: '/admin/products',
            icon: (
                <PlusIcon className="w-6 h-6" />
            ),
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold ">Dashboard</h1>
                <p className="text-gray-600 mt-1">Bienvenido al panel de administración</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="bg rounded-lg shadow p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
                    >
                        <div className={`p-3 mb-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                            {stat.icon}
                        </div>
                            <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                            <p className="text-3xl font-bold ">{stat.value}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold  mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="bg rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    {action.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold  mb-1">{action.title}</h3>
                                    <p className="text-sm text-gray-600">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Products */}
            {products.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold ">Productos Recientes</h2>
                        <Link
                            href="/admin/products"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Ver todos →
                        </Link>
                    </div>
                    <div className="bg rounded-lg shadow overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {products.slice(0, 5).map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}`}
                                    className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                                >

                                    <div className="flex-1">
                                        <h3 className="font-medium ">{product.name}</h3>
                                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 10
                                                ? 'bg-green-100 text-green-800'
                                                : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        Stock: {product.stock}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}