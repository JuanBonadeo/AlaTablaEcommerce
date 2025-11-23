"use server";

import { OrderService } from "@/core/orders/order.service";
import { CreateOrderInput, OrderStatus, OrderListParams } from "@/lib/types/order.types";

export const createOrderAction = async (data: CreateOrderInput) => {
  return await OrderService.create(data);
};

export const getOrderByIdAction = async (id: string) => {
  return await OrderService.getById(id);
};

export const getOrdersByUserIdAction = async (userId: string) => {
  return await OrderService.getByUserId(userId);
};

export const getAllOrdersAction = async (params?: OrderListParams) => {
  return await OrderService.list(params || {});
};

export const updateOrderStatusAction = async (id: string, status: OrderStatus) => {
  return await OrderService.updateStatus(id, status);
};

export const cancelOrderAction = async (id: string) => {
  return await OrderService.updateStatus(id, OrderStatus.CANCELED);
};
