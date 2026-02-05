import { getProductByIdAction, getAllCategoriesAction } from '@/lib/actions/product/product.actions';
import { notFound } from 'next/navigation';
import EditProductClient from './EditProductClient';

interface EditProductPageProps {
  params: {
    id: string;
  };
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
