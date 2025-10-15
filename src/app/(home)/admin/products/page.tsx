

import { getAllProductsAction } from "@/web/actions/product.actions";
import { AdminProductGrid } from "@/web/components/admin/AdminproductGrid";
import Link from "next/link";



export default async function AdminProductsPage() {
    const { data: products } = await getAllProductsAction();
    
    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Productos</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md"
                >
                    + Nuevo producto
                </Link>
            </div>
            <AdminProductGrid products={products} />
        </div>
    );
}
