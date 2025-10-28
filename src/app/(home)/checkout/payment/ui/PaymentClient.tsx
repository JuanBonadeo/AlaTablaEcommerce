'use client'

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart-stores';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import { useRouter } from 'next/navigation';

const BANK_ALIAS = 'ALAT.ECOMMERCE.ALIAS'; // Cambialo por el alias real cuando esté disponible
const BANK_ACCOUNT = 'CBU: 0000000000000000000000';

const PaymentClient = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { subTotal, total, itemsIn } = useCartStore(state => state.getSummaryInfo());

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copyAlias = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ALIAS);
      setCopied(true);
    } catch (e) {
      console.warn('No se pudo copiar el alias', e);
    }
  };

  return (
    <div className="flex justify-center items-center mb-20 px-2 lg:px-0">
      <div className="flex flex-col w-[1000px] gap-6">
        <div className="bg rounded-xl shadow-xl p-6">
          <h2 className="text-2xl mb-3">Datos de pago</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-600">Nro. Productos</span>
              <div className="font-medium">{itemsIn === 1 ? '1 artículo' : `${itemsIn} artículos`}</div>
            </div>

            <div className="text-right">
              <span className="text-sm text-gray-600">Subtotal</span>
              <div className="font-medium">{currencyFormat(subTotal)}</div>
            </div>
          </div>

          <div className="w-full h-0.5 rounded bg-gray-200 mb-4" />

          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl">Total a pagar</h3>
              <div className="text-3xl font-bold mt-1">{currencyFormat(total)}</div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>Forma de pago: Transferencia bancaria</div>
              <div className="mt-2">Alias donde pagar:</div>
              <div className="flex items-center gap-3 mt-2">
                <div className="font-mono font-medium">{BANK_ALIAS}</div>
                <button onClick={copyAlias} className="btn-primary btn-sm">{copied ? 'Copiado' : 'Copiar'}</button>
              </div>
              <div className="mt-3 text-xs text-gray-500">También podés pagar con CBU: <span className="font-mono">{BANK_ACCOUNT}</span></div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button className="btn-secondary" onClick={() => router.push('/checkout/confirm')}>Volver</button>
            <button className="btn-primary" onClick={() => router.push('/orders')}>Ya pagué (marcar como pagado)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentClient;
