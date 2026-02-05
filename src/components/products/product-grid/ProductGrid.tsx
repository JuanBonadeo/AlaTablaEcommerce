
import { ProductGridItem } from '@/lib/types/product.types.js';
import { ProductGridItemComponent } from './ProductGridItem';




interface Props {
  products: ProductGridItem[];
}


export const ProductGrid = ( { products }: Props ) => {
  if ( !products || products.length === 0 ) {
    return <div>No products found.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-10 mb-10">
      {
        products.map( product => (
          <ProductGridItemComponent
            key={ product.slug }
            product={ product }
          />
        ) )
      }

    </div>
  );
};