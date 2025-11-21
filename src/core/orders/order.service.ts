import { OrderDAO } from "./order.dao";
import {
  CreateOrderInput,
  CreateOrderSchema,
  UpdateOrderInput,
  UpdateOrderSchema,
  OrderListParams,
  OrderListParamsSchema,
  OrderStatus,
} from "@/lib/types/order.types";
import { ErrorHandler, NotFoundError } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";

export const OrderService = {
  create: async (data: CreateOrderInput) => {
    try {
      const validatedData = CreateOrderSchema.parse(data);
      const order = await OrderDAO.create(validatedData);
      return ResponseHandler.created(order);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getById: async (id: string) => {
    try {
      const order = await OrderDAO.getById(id);
      if (!order) throw new NotFoundError("Orden no encontrada");
      return ResponseHandler.success(order);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getByUserId: async (userId: string) => {
    try {
      const orders = await OrderDAO.getByUserId(userId);
      return ResponseHandler.success(orders);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  update: async (id: string, data: UpdateOrderInput) => {
    try {
      const validatedData = UpdateOrderSchema.parse(data);
      
      // Verify order exists
      const existing = await OrderDAO.getById(id);
      if (!existing) throw new NotFoundError("Orden no encontrada");

      const order = await OrderDAO.update(id, validatedData);
      return ResponseHandler.updated(order);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  updateStatus: async (id: string, status: OrderStatus) => {
    try {
      const existing = await OrderDAO.getById(id);
      if (!existing) throw new NotFoundError("Orden no encontrada");

      const order = await OrderDAO.update(id, { status });
      return ResponseHandler.updated(order);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  list: async (params: OrderListParams) => {
    try {
      const validatedParams = OrderListParamsSchema.parse(params);
      const result = await OrderDAO.list(validatedParams);
      return ResponseHandler.success(result);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },
};
