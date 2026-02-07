import { prisma } from '@/db/client';
import { CreatePaymentInput, UpdatePaymentInput } from '@/lib/types/order.types';
import { Payment } from '@prisma/client';

export const PaymentDAO = {
  create: async (data: CreatePaymentInput): Promise<Payment> => {
    return prisma.payment.create({
      data: {
        orderId: data.orderId,
        provider: data.provider,
        status: data.status,
        amount: data.amount,
        transactionId: data.transactionId,
        notes: data.notes,
      },
    });
  },

  getById: async (id: string) => {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  },

  getByOrderId: async (orderId: string) => {
    return prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  },

  update: async (id: string, data: UpdatePaymentInput): Promise<Payment> => {
    return prisma.payment.update({
      where: { id },
      data,
    });
  },

  list: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take,
        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count(),
    ]);

    return {
      items,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
        total,
      },
    };
  },
};
