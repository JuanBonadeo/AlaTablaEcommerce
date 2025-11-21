"use server";

import { PaymentService } from "@/core/payments/payment.service";
import { CreatePaymentInput, UpdatePaymentInput } from "@/lib/types/order.types";

export const createPaymentAction = async (data: CreatePaymentInput) => {
  return await PaymentService.create(data);
};

export const getPaymentByIdAction = async (id: string) => {
  return await PaymentService.getById(id);
};

export const getPaymentByOrderIdAction = async (orderId: string) => {
  return await PaymentService.getByOrderId(orderId);
};

export const updatePaymentAction = async (id: string, data: UpdatePaymentInput) => {
  return await PaymentService.update(id, data);
};

export const notifyPaymentAction = async (orderId: string, amount: number) => {
  // This will create a payment record with PENDING status
  return await PaymentService.create({
    orderId,
    provider: "TRANSFERENCIA",
    amount,
  });
};

export const markPaymentAsTransferredAction = async (orderId: string) => {
  return await PaymentService.markAsTransferred(orderId);
};
