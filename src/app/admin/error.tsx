'use client';

import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-[#171718] border border-red-900/50 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">
            Algo salió mal
          </h1>
          
          <p className="text-gray-400 mb-2">
            Ha ocurrido un error en el panel de administración
          </p>
          
          {error.message && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-6 mt-6">
              <p className="text-red-400 text-sm font-mono">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-gray-500 text-xs mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={18} />
              Intentar nuevamente
            </button>
            
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home size={18} />
              Volver al inicio
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">
            Si el problema persiste, por favor contacta al soporte técnico
          </p>
        </div>
      </div>
    </div>
  );
}
