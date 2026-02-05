import Link from 'next/link';


import {  Title } from '@/components/ui/Title';
import { ProductsIncart } from './ui/ProductsIncart';
import { OrderSummary } from './ui/OrderSummary';





export default function Cart() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] md:pb-20 px-3 sm:px-6 lg:px-10 pt-4 sm:pt-8">

      <div className="max-w-7xl mx-auto">

        <div className="mb-6 sm:mb-8">
          <Title title='Carrito' size='4xl'/>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">

          {/* Checkout - Resumen de orden (Mobile First) */ }
          <div className="lg:col-span-1 order-first">
            <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl shadow-2xl p-4 sm:p-7 border border-linear-gradient(to right, rgb(249 115 22), rgb(234 88 12))-500/20 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-linear-gradient(to right, rgb(249 115 22), rgb(234 88 12))-500 rounded-full"></div>
                <h2 className="text-lg sm:text-2xl text-white font-bold">Resumen</h2>
              </div>

              <OrderSummary/>
            </div>
          </div>

          {/* Carrito */ }
          <div className="lg:col-span-2 flex flex-col order-last lg:order-first">
            <div className="mb-4 sm:mb-5 bg-[#171718] rounded-xl p-4 border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base sm:text-lg text-white font-semibold block mb-1">Tus Productos</span>
                  <Link href="/" className="text-linear-gradient(to right, rgb(249 115 22), rgb(234 88 12))-400 hover:text-linear-gradient(to right, rgb(249 115 22), rgb(234 88 12))-300 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1">
                    <span>← Seguir comprando</span>
                  </Link>
                </div>
              </div>
            </div>
         

          {/* Items */ }
            <ProductsIncart/>
           </div>


        </div>


      </div>

    </div>
  );
}