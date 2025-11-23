import { z } from "zod";
import { OrderStatus, PaymentProvider, PaymentStatus, ShipmentStatus } from "@prisma/client";

// Re-export Prisma enums
export { OrderStatus, PaymentProvider, PaymentStatus, ShipmentStatus };

// =========================
// INTERFACES
// =========================

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: { id: string; url: string }[];
  };
  variant?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  transactionId?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier?: string | null;
  tracking?: string | null;
  status: ShipmentStatus;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
}

export interface Order {
  id: string;
  userId: string;
  addressId?: string | null;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  payment?: Payment | null;
  shipment?: Shipment | null;
  address?: {
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  } | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// =========================
// VALIDATION SCHEMAS
// =========================

export const CreateOrderItemSchema = z.object({
  productId: z.string().min(1, "El ID del producto es requerido"),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, "La cantidad debe ser al menos 1"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
});

export const CreateOrderSchema = z.object({
  userId: z.string().min(1, "El ID del usuario es requerido"),
  addressId: z.string().optional(),
  items: z
    .array(CreateOrderItemSchema)
    .min(1, "Debe incluir al menos un producto"),
  total: z.number().min(0, "El total debe ser mayor o igual a 0"),
});

export const UpdateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  addressId: z.string().optional(),
});

export const CreatePaymentSchema = z.object({
  orderId: z.string().min(1, "El ID de la orden es requerido"),
  provider: z.nativeEnum(PaymentProvider),
  amount: z.number().min(0, "El monto debe ser mayor o igual a 0"),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdatePaymentSchema = z.object({
  status: z.nativeEnum(PaymentStatus).optional(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export const CreateShipmentSchema = z.object({
  orderId: z.string().min(1, "El ID de la orden es requerido"),
  carrier: z.string().optional(),
  tracking: z.string().optional(),
});

export const UpdateShipmentSchema = z.object({
  status: z.nativeEnum(ShipmentStatus).optional(),
  carrier: z.string().optional(),
  tracking: z.string().optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
});

// =========================
// TYPE EXPORTS
// =========================

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;
export type CreateShipmentInput = z.infer<typeof CreateShipmentSchema>;
export type UpdateShipmentInput = z.infer<typeof UpdateShipmentSchema>;

// =========================
// LIST & PAGINATION
// =========================

export const OrderListParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).default(10).optional(),
  userId: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

export type OrderListParams = z.infer<typeof OrderListParamsSchema>;

export interface OrderList {
  items: Order[];
  pagination: {
    totalPages: number;
    currentPage: number;
    limit: number;
    total: number;
  };
}