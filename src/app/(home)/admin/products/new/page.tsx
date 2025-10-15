import { getAllCategories } from "@/web/actions/category.actions";
import CreateProductForm from "@/web/components/admin/CreateProductForm";


export default async function NewProductPage() {
  // Esta parte se ejecuta en el servidor
  const { data: categories } = await getAllCategories();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Crear Producto</h1>
      <CreateProductForm categories={categories} />
    </div>
  );
}
