import { getAllCategories } from '@/web/actions/category.actions';
import { getProductBySlugAction } from '@/web/actions/product.actions';
import CreateProductForm from "@/web/components/admin/CreateProductForm";


type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export default async function NewProductPage({ params }: PageProps) {
  // Esta parte se ejecuta en el servidor
    const { slug } = await params;
  const { data: categories } = await getAllCategories();
  const { data: product } = await getProductBySlugAction(slug);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Crear Producto</h1>
      <CreateProductForm categories={categories} initialData={product} />
    </div>
  );
}
