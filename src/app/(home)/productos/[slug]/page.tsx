
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/product/addToCart/AddToCart';
import { ProductMobileSlideshow } from '@/components/product/slideshow/ProductMobileSlideshow';
import { ProductSlideshow } from '@/components/product/slideshow/ProductSlideshow';
import { getProductBySlugAction } from '@/lib/actions/product/product.actions';
import { calculatePrice, formatPrice } from '@/lib/utils/pricing';
import { AlertCircle, CheckCircle2, Truck } from 'lucide-react';


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
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">

      {/* Slideshow */}
      <div className="col-span-1 lg:col-span-2 bg-[#171718] rounded-xl overflow-hidden border border-gray-800 shadow-xl">

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
          className="hidden lg:block"
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1" >
        <div className="bg-[#171718] rounded-xl p-6 border border-gray-800 shadow-xl sticky top-24">

          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                <CheckCircle2 size={12} /> Stock disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                <AlertCircle size={12} /> Sin stock
              </span>
            )}
          </div>

          <h1 className="antialiased font-bold text-3xl mb-4 text-white">
            {product.name}
          </h1>

          {/* Precio con oferta */}
          {priceInfo.hasOffer ? (
            <div className="mb-6 bg-[#0a0a0a] p-4 rounded-lg border border-gray-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 line-through text-lg">
                  {formatPrice(priceInfo.originalPrice)}
                </span>
                <div className="flex items-center gap-2 bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-orange-900/40 animate-pulse">
                  <span>-{priceInfo.discount}% OFF</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(priceInfo.finalPrice)}
                </span>
              </div>

              <p className="text-sm text-green-500 font-medium flex items-center gap-1">
                Ahorrás {formatPrice(priceInfo.savings || 0)}
              </p>

              {activeOffer?.descripcion && (
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-800 italic flex items-center gap-2">
                  <AlertCircle size={12} />
                  {activeOffer.descripcion}
                </p>
              )}

              <p className="text-[10px] text-gray-600 mt-1">
                Oferta válida hasta {new Date(activeOffer?.hasta || '').toLocaleDateString('es-ES')}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-3xl font-bold text-white">{formatPrice(product.price)}</p>
            </div>
          )}

          <AddToCart product={product} />

          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Envío a todo el país</p>
                <p className="text-xs text-gray-500">Calculá el costo en el checkout</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="font-bold text-lg mb-3 text-white">Descripción</h3>
            <div className="text-gray-400 font-light text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}