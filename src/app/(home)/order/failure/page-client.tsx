'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function OrderFailurePageClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago Rechazado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Lo sentimos, no pudimos procesar tu pago. Por favor, intenta nuevamente con otro método de pago.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/checkout/confirm"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Intentar nuevamente
          </Link>
          
          <Link
            href="/cart"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Volver al carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
