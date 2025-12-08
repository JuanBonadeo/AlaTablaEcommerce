import { getAllCategoriesAction } from '@/lib/actions/product/product.actions';
import NewProductForm from './NewProductForm';

export default async function NewProductPage() {
  const categories = await getAllCategoriesAction();
  
  return <NewProductForm categories={categories} />;
}
