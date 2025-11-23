"use client"
import { Product } from '@/lib/types/product.types.js'
import { deleteProductAction } from '@/lib/actions/product/product.actions'
import { revalidatePath } from 'next/cache.js'
import Link from 'next/link.js'
import { useRouter } from 'next/navigation.js'



export const AdminProductGrid = ({ products }: { products: Product[] }) => {
    const router = useRouter();
    const handleDelete = async (id: string) => {
        await deleteProductAction(id);
        router.refresh();

    };

    return (

        <table className="w-full border border-neutral-700 rounded-md overflow-hidden">
            <thead className="bg-neutral-800">
                <tr>
                    <th className="text-left px-4 py-2 text-gray-300">Nombre</th>
                    <th className="text-left px-4 py-2 text-gray-300">Precio</th>
                    <th className="text-left px-4 py-2 text-gray-300">Stock</th>
                    <th className="text-left px-4 py-2 text-gray-300">Categoría</th>
                    <th className="px-4 py-2 text-gray-300">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {products.map((p) => (
                    <tr
                        key={p.id}
                        className="border-t border-neutral-700 hover:bg-neutral-800/40"
                    >
                        <td className="px-4 py-2 text-white">{p.name}</td>
                        <td className="px-4 py-2 text-white">${p.price}</td>
                        <td className="px-4 py-2 text-white">{p.stock}</td>
                        <td className="px-4 py-2 text-white">
                            {p.category?.name ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-center space-x-2">
                            <Link
                                href={`/admin/products/new/${p.slug}`}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Editar
                            </Link>

                            <button
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Eliminar
                            </button>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

    )
}
