import Link from 'next/link';


import {  Title } from '@/components/ui/Title';
import { ProductsIncart } from './ui/ProductsIncart';
import { OrderSummary } from './ui/OrderSummary';





export default function Cart() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 ">

      <div className="flex flex-col w-[1000px]">

        <Title title='Carrito' size='4xl'/>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */ }
          <div className="flex flex-col mt-5">
            <span className="text-xl">Agregar más items</span>
            <Link href="/" className="underline mb-5">
              Continúa comprando
            </Link>
         

          {/* Items */ }
            <ProductsIncart/>
           </div>

          {/* Checkout - Resumen de orden */ }
          <div className="bg rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <OrderSummary/>

          </div>


        </div>


      </div>

    </div>
  );
}