export const revalidate = 604800  // 7 dias

import { notFound } from 'next/navigation';

import { ProductMobileSlideshow } from 'src/components/product/slideshow/ProductMobileSlideshow';
import { ProductSlideshow } from 'src/components/product/slideshow/ProductSlideshow';
// import { getProductBySlug } from '@/actions/products/get-product-by-slug';
import { Metadata, ResolvingMetadata } from 'next';
import { StockLabel } from 'src/components/product/stock-label/StockLabel';
import { AddToCart } from 'src/components/product/addToCart/AddToCart';

const product = {
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

interface Props {
  params: {
    slug: string;
  };
}


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const slug = (await params).slug

  // fetch data
  // const product = await getProductBySlug(slug)

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.name ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.name ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  }
}


export default async function Product({ params }: Props) {

  const { slug } = params;
  // const product = await getProductBySlug(slug)

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