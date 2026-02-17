import { getAllCategoriesAction } from '@/lib/actions/product/product.actions';
import NewProductForm from './NewProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await getAllCategoriesAction();
  
  return <NewProductForm categories={categories} />;
}
