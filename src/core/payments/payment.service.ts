import { PaymentDAO } from "./payment.dao";
import { OrderDAO } from "../orders/order.dao";
import {
  CreatePaymentInput,
  CreatePaymentSchema,
  UpdatePaymentInput,
  UpdatePaymentSchema,
  OrderStatus,
  PaymentStatus,
} from "@/lib/types/order.types";
import { ErrorHandler, NotFoundError } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";

export const PaymentService = {
  create: async (data: CreatePaymentInput) => {
    try {
      const validatedData = CreatePaymentSchema.parse(data);
      
      const order = await OrderDAO.getById(validatedData.orderId);
      if (!order) throw new NotFoundError("Orden no encontrada");

      const existingPayment = await PaymentDAO.getByOrderId(validatedData.orderId);
      if (existingPayment) {
        throw new Error("Ya existe un pago para esta orden");
      }

      const payment = await PaymentDAO.create(validatedData);
      
      if (payment.status === PaymentStatus.COMPLETED) {
        await OrderDAO.update(validatedData.orderId, { status: OrderStatus.PAID });
      }

      return ResponseHandler.created(payment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getById: async (id: string) => {
    try {
      const payment = await PaymentDAO.getById(id);
      if (!payment) throw new NotFoundError("Pago no encontrado");
      return ResponseHandler.success(payment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getByOrderId: async (orderId: string) => {
    try {
      const payment = await PaymentDAO.getByOrderId(orderId);
      if (!payment) throw new NotFoundError("Pago no encontrado");
      return ResponseHandler.success(payment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  update: async (id: string, data: UpdatePaymentInput) => {
    try {
      const validatedData = UpdatePaymentSchema.parse(data);
      const payment = await PaymentDAO.update(id, validatedData);
      
      if (validatedData.status === PaymentStatus.COMPLETED) {
        await OrderDAO.update(payment.orderId, { status: OrderStatus.PAID });
      }

      return ResponseHandler.updated(payment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  list: async (page = 1, limit = 10) => {
    try {
      const result = await PaymentDAO.list(page, limit);
      return ResponseHandler.success(result);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  markAsTransferred: async (orderId: string) => {
    try {
      const payment = await PaymentDAO.getByOrderId(orderId);
      
      if (!payment) {
        // If no payment exists, create one with TRANSFERRED status
        const order = await OrderDAO.getById(orderId);
        if (!order) throw new NotFoundError("Orden no encontrada");
        
        const newPayment = await PaymentDAO.create({
          orderId,
          provider: "TRANSFERENCIA",
          amount: order.total,
        });
        
        const updatedPayment = await PaymentDAO.update(newPayment.id, { 
          status: PaymentStatus.TRANSFERRED 
        });
        
        return ResponseHandler.success(updatedPayment);
      }
      
      // Update existing payment to TRANSFERRED status
      const updatedPayment = await PaymentDAO.update(payment.id, { 
        status: PaymentStatus.TRANSFERRED 
      });
      
      return ResponseHandler.success(updatedPayment);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },
};
