'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function OrderPendingPageClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <Clock className="w-20 h-20 text-yellow-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago Pendiente
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos por correo electrónico cuando se complete.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/profile/orders"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Ver mis órdenes
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
