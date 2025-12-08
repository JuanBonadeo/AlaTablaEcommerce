
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/product/addToCart/AddToCart';
import { ProductMobileSlideshow } from '@/components/product/slideshow/ProductMobileSlideshow';
import { ProductSlideshow } from '@/components/product/slideshow/ProductSlideshow';
import { getProductBySlugAction } from '@/lib/actions/product/product.actions';
import { calculatePrice, formatPrice } from '@/lib/utils/pricing';


type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function Product({ params }: PageProps) {

  const { slug } = await params;
  const product = await getProductBySlugAction(slug);
  
  if (!product) {
    notFound();
  }

  // Calcular precio con oferta
  const activeOffer = product.offers?.[0] || null;
  const priceInfo = calculatePrice(product.price, activeOffer);


  return (
    <div className="mt-5 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-3">

      {/* Slideshow */}
      <div className="col-span-1 lg:col-span-2 ">

        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.name}
          images={product.images?.map((img: { url: string }) => img.url) ?? []}
          className="block lg:hidden"
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.name}
          images={product.images?.map((img: { url: string }) => img.url) ?? []}
          className="hidden lg:block max-w-3xl "
        />


      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5 lg:mt-20" >

        {/* <StockLabel slug={product.slug} /> */}

        <h1 className={`  antialiased font-bold text-3xl`}>
          {product.name}
        </h1>

        {/* Precio con oferta */}
        {priceInfo.hasOffer ? (
          <div className="my-5">
            {/* Badge de oferta */}
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full mb-3">
              <span className="font-bold text-lg">-{priceInfo.discount}% OFF</span>
            </div>
            
            {activeOffer?.descripcion && (
              <p className="text-sm text-gray-600 mb-2 italic">{activeOffer.descripcion}</p>
            )}
            
            <div className="flex items-baseline gap-3">
              <span className="text-gray-500 line-through text-lg">
                ${formatPrice(priceInfo.originalPrice)}
              </span>
              <span className="text-3xl font-bold text-orange-500">
                ${formatPrice(priceInfo.finalPrice)}
              </span>
            </div>
            
            <p className="text-sm text-green-600 mt-1">
              Ahorrás ${formatPrice(priceInfo.savings || 0)}
            </p>
            
            <p className="text-xs text-gray-500 mt-2">
              Oferta válida hasta {new Date(activeOffer?.hasta || '').toLocaleDateString('es-ES')}
            </p>
          </div>
        ) : (
          <p className="text-xl mb-5">${product.price}</p>
        )}

        <AddToCart product={product} />

        {/* Descripción */}
        <h3 className="font-bold text-xl mt-8">Descripción</h3>
        <p className="font-light">
          {product.description}
        </p>

      </div>

    </div>
  );
}