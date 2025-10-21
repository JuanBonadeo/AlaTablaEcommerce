
import { ProductGridItem } from '@/lib/types/product.types.js';
import { ProductGridItemComponent } from './ProductGridItem';




interface Props {
  products: ProductGridItem[];
}


export const ProductGrid = ( { products }: Props ) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
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