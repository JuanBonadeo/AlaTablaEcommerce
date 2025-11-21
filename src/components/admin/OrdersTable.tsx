'use client';

import { cancelOrderAction, updateOrderStatusAction } from '@/lib/actions/order/order.actions';
import { Order, OrderStatus } from '@/lib/types/order.types';
import { currencyFormat } from '@/lib/helpers/currencyFormat';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{ orderId: string; action: 'cancel' | 'status'; newStatus?: OrderStatus } | null>(null);

  const handleCancelOrder = (orderId: string) => {
    setModalData({ orderId, action: 'cancel' });
    setShowModal(true);
  };

  const handleChangeStatus = (orderId: string, newStatus: OrderStatus) => {
    setModalData({ orderId, action: 'status', newStatus });
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!modalData) return;

    try {
      setProcessingId(modalData.orderId);
      setShowModal(false);

      let result;
      if (modalData.action === 'cancel') {
        result = await cancelOrderAction(modalData.orderId);
      } else if (modalData.action === 'status' && modalData.newStatus) {
        result = await updateOrderStatusAction(modalData.orderId, modalData.newStatus);
      }

      if (result?.success) {
        router.refresh();
      }
    } catch (err) {
      console.error('Error processing action:', err);
    } finally {
      setProcessingId(null);
      setModalData(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'SHIPPED': 'bg-blue-100 text-blue-800',
      'DELIVERED': 'bg-emerald-100 text-emerald-800',
      'CANCELED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PAID': 'Pagado',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELED': 'Cancelado',
    };
    return texts[status] || status;
  };

  return (
    <>
      {/* Modal */}
      {showModal && modalData && (
        <div className="fixed -inset-4  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {modalData.action === 'cancel' ? 'Cancelar orden' : 'Cambiar estado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {modalData.action === 'cancel' 
                ? '¿Estás seguro de que deseas cancelar esta orden? El stock será restaurado.'
                : `¿Confirmas cambiar el estado de la orden a "${getStatusText(modalData.newStatus || '')}"?`
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                No, volver
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sí, confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-800 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                
                return (
                  <tr key={order.id} className="hover:bg-stone-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-md font-medium text-gray-200">
                          #{order.id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {itemsCount} {itemsCount === 1 ? 'artículo' : 'artículos'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-200">{order.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {currencyFormat(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.status)} cursor-pointer disabled:opacity-30 disabled:cursor-default`}
                        value={order.status}
                        onChange={(e) => handleChangeStatus(order.id, e.target.value as OrderStatus)}
                        disabled={processingId === order.id || order.status === 'CANCELED'}
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="PAID">Pagado</option>
                        <option value="SHIPPED">Enviado</option>
                        <option value="DELIVERED">Entregado</option>
                        <option value="CANCELED">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/order/${order.id}/payment`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Ver
                      </Link>
                      {order.status !== 'CANCELED' && order.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={processingId === order.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {processingId === order.id ? 'Cancelando...' : 'Cancelar'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
