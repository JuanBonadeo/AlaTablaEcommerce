
import { notFound } from 'next/navigation';
import { AddToCart } from '@/web/components/product/addToCart/AddToCart';
import { ProductMobileSlideshow } from '@/web/components/product/slideshow/ProductMobileSlideshow';
import { ProductSlideshow } from '@/web/components/product/slideshow/ProductSlideshow';
import { Product as ProductInterface } from '@/lib/types/product.types.js';
import { getProductBySlug } from '@/web/helpers/getProductBySlug';


const product: ProductInterface = {
  id: "1",
  name: "Product 1",
  slug: "product-1",
  description: "Description for Product 1",
  price: 29.99,
  stock: 100,
  categoryId: "1",
  images: [
    {
      id: "1",
      url: "image.png",
      productId: "1",
    },
    {
      id: "2",
      url: "image.png",
      productId: "1",
    },
  ],
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function Product({ params }: PageProps) {

  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }


  return (
    <div className="mt-5 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-3">

      {/* Slideshow */}
      <div className="col-span-1 lg:col-span-2 ">

        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.name}
          images={product.images.map(img => img.url)}
          className="block lg:hidden"
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.name}
          images={product.images.map(img => img.url)}
          className="hidden lg:block "
        />


      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5 lg:mt-20" >

        {/* <StockLabel slug={product.slug} /> */}

        <h1 className={`  antialiased font-bold text-xl`}>
          {product.name}
        </h1>


        <p className="text-lg mb-5">${product.price}</p>
        <AddToCart product={product} />

        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">
          {product.description}
        </p>

      </div>

    </div>
  );
}