import { getProductByIdAction, getAllCategoriesAction } from '@/lib/actions/product/product.actions';
import { notFound } from 'next/navigation';
import EditProductClient from './EditProductClient';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductByIdAction(id),
    getAllCategoriesAction(),
  ]);

  if (!product) {
    notFound();
  }

  return <EditProductClient product={product} categories={categories} />;
}
