import { prisma } from '@/db/client';
import { CreateShipmentInput, UpdateShipmentInput } from '@/lib/types/order.types';
import { Shipment } from '@prisma/client';

export const ShipmentDAO = {
  create: async (data: CreateShipmentInput): Promise<Shipment> => {
    return prisma.shipment.create({
      data: {
        orderId: data.orderId,
        carrier: data.carrier,
        service: data.service,
        serviceName: data.serviceName,
        cost: data.cost,
        estimatedDays: data.estimatedDays,
        tracking: data.tracking,
      },
    });
  },

  getById: async (id: string) => {
    return prisma.shipment.findUnique({
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
            address: true,
          },
        },
      },
    });
  },

  getByOrderId: async (orderId: string) => {
    return prisma.shipment.findUnique({
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
            address: true,
          },
        },
      },
    });
  },

  update: async (id: string, data: UpdateShipmentInput): Promise<Shipment> => {
    return prisma.shipment.update({
      where: { id },
      data,
    });
  },

  list: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const take = limit;

    const [items, total] = await Promise.all([
      prisma.shipment.findMany({
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
              address: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      }),
      prisma.shipment.count(),
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
