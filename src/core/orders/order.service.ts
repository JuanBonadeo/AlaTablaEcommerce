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
import { prisma } from "@/db/client";

export const OrderService = {
  create: async (data: CreateOrderInput) => {
    try {
      const validatedData = CreateOrderSchema.parse(data);
      
      // Use transaction to create order and update stock atomically
      const order = await prisma.$transaction(async (tx) => {
        // Decrease stock for each item
        for (const item of validatedData.items) {
          if (item.variantId) {
            // Update variant stock
            const variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
              select: { stock: true, name: true },
            });

            if (!variant) {
              throw new Error(`Variante ${item.variantId} no encontrada`);
            }

            if ((variant.stock ?? 0) < item.quantity) {
              throw new Error(`Stock insuficiente para la variante ${variant.name}`);
            }

            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          } else {
            // Update product stock
            const product = await tx.product.findUnique({
              where: { id: item.productId },
              select: { stock: true, name: true },
            });

            if (!product) {
              throw new Error(`Producto no encontrado`);
            }

            if (product.stock < item.quantity) {
              throw new Error(`Stock insuficiente para el producto ${product.name}`);
            }

            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        // Create the order
        return await tx.order.create({
          data: {
            userId: validatedData.userId,
            addressId: validatedData.addressId,
            total: validatedData.total,
            items: {
              create: validatedData.items.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: { 
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: {
                      select: { id: true, url: true },
                      take: 1,
                    },
                  },
                },
                variant: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            payment: true,
            shipment: true,
            address: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      });

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

      const previousStatus = existing.status;

      // Use transaction when canceling an order to restore stock
      if (status === OrderStatus.CANCELED && previousStatus !== OrderStatus.CANCELED) {
        const order = await prisma.$transaction(async (tx) => {
          // Restore stock for each item
          for (const item of existing.items) {
            if (item.variantId) {
              // Restore variant stock
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              });
            } else {
              // Restore product stock
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
              });
            }
          }

          // Update order status
          return await tx.order.update({
            where: { id },
            data: { status },
            include: {
              items: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      images: {
                        select: { id: true, url: true },
                        take: 1,
                      },
                    },
                  },
                  variant: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
              payment: true,
              shipment: true,
              address: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });
        });

        return ResponseHandler.updated(order);
      }

      // For other status updates, just update without transaction
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
