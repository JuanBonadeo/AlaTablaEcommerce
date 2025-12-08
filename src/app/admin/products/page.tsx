import { getAllProductsAction, getAllCategoriesAction, deleteProductAction } from '@/lib/actions/product/product.actions';
import ProductsList from './ProductsList';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAction(),
    getAllCategoriesAction(),
  ]);

  return <ProductsList initialProducts={products} categories={categories} />;
}
