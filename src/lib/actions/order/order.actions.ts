"use server";

import { OrderService } from "@/core/orders/order.service";
import { CreateOrderInput, OrderStatus, OrderListParams } from "@/lib/types/order.types";
import { revalidatePath } from 'next/cache';

export const createOrderAction = async (data: CreateOrderInput) => {
  return await OrderService.create(data);
};

export const getOrderByIdAction = async (id: string) => {
  const result = await OrderService.getById(id);
  if (!result.success) return null;
  return result.data;
};

export const getOrdersByUserIdAction = async (userId: string) => {
  return await OrderService.getByUserId(userId);
};

export const getAllOrdersAction = async (params?: OrderListParams) => {
  const result = await OrderService.list(params || {});
  if (!result.success) {
    return { items: [], pagination: { totalPages: 0, currentPage: 1, limit: 10, total: 0 } };
  }
  return result.data;
};

export const updateOrderStatusAction = async (id: string, status: OrderStatus) => {
  const result = await OrderService.updateStatus(id, status);

  if (!result.success) {
    return { ok: false, message: result.message || 'Error al actualizar el estado' };
  }

  revalidatePath('/admin/orders');
  return { ok: true, message: 'Estado actualizado exitosamente' };
};

export const cancelOrderAction = async (id: string) => {
  const result = await OrderService.updateStatus(id, OrderStatus.CANCELED);
  return { ok: result.success, message: result.message };
};

export async function getOrderStatsAction() {
  try {
    const result = await OrderService.list({ limit: 1000 });

    if (!result.success || !result.data) {
      return {
        total: 0,
        pending: 0,
        paid: 0,
        shipped: 0,
        delivered: 0,
        canceled: 0,
        revenue: 0,
      };
    }

    const orders = result.data.items;

    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      paid: orders.filter(o => o.status === 'PAID').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      canceled: orders.filter(o => o.status === 'CANCELED').length,
      revenue: orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + o.total, 0),
    };
  } catch (error) {
    console.error('Error en getOrderStatsAction:', error);
    return {
      total: 0,
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      canceled: 0,
      revenue: 0,
    };
  }
}

