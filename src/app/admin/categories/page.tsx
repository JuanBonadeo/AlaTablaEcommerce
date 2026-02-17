import { getAllCategoriesAction } from '@/lib/actions/category/category.actions';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getAllCategoriesAction();

  return <CategoriesClient categories={categories} />;
}

