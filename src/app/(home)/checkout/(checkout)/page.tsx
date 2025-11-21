import Link from 'next/link';
import { Title } from '@/components/ui/Title.jsx';
import { ProductsIncart } from './ui/ProductsIncart';
import { PlaceOrder } from './ui/PlaceOrder';
import { requireAuth } from '@/lib/auth/require-auth';

export default async function Checkout() {
  await requireAuth();

  return (
    <div className="flex justify-center items-center mb-72 px-10 lg:px-0">

      <div className="flex flex-col w-[1000px]">

        <Title title='Verificar orden' />


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {/* Items */}
            <ProductsIncart />
          </div>


          {/* Checkout - Resumen de orden */}
          <PlaceOrder />


        </div>

      </div>

    </div>
  );
}