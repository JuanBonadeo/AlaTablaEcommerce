import { getAllOffersAction } from '@/lib/actions/offer/offer.actions';
import { getAllProductsAction } from '@/lib/actions/product/product.actions';
import OffersClient from './OffersClient';

export default async function OffersPage() {
  const [offers, products] = await Promise.all([
    getAllOffersAction(),
    getAllProductsAction()
  ]);

  return <OffersClient offers={offers} products={products} />;
}

