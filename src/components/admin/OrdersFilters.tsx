'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { OrderStatus } from '@/lib/types/order.types';

interface OrdersFiltersProps {
  currentStatus?: OrderStatus;
}

export function OrdersFilters({ currentStatus }: OrdersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (status === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    
    params.delete('page'); // Reset to page 1 when filtering
    
    router.push(`/admin/orders?${params.toString()}`);
  };

  const statuses = [
    { value: 'ALL', label: 'Todas' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'PAID', label: 'Pagado' },
    { value: 'SHIPPED', label: 'Enviado' },
    { value: 'DELIVERED', label: 'Entregado' },
    { value: 'CANCELED', label: 'Cancelado' },
  ];

  return (
    <div className="mb-6 bg rounded-lg shadow p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-200">Filtrar por estado:</label>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                (status.value === 'ALL' && !currentStatus) || status.value === currentStatus
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
