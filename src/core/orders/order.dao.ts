import { prisma } from '@/db/client';
import { 
  CreateOrderInput, 
  UpdateOrderInput, 
  OrderListParams,
  OrderList
} from '@/lib/types/order.types';
import { Order, Prisma } from '@prisma/client';

export const OrderDAO = {
  create: async (data: CreateOrderInput): Promise<Order> => {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        addressId: data.addressId,
        total: data.total,
        items: {
          create: data.items.map(item => ({
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
    return order;
  },

  getById: async (id: string) => {
    return prisma.order.findUnique({
      where: { id },
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
  },

  getByUserId: async (userId: string) => {
    return prisma.order.findMany({
      where: { userId },
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
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  update: async (id: string, data: UpdateOrderInput): Promise<Order> => {
    return prisma.order.update({
      where: { id },
      data,
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
  },

  list: async (params: OrderListParams): Promise<OrderList> => {
    const { page = 1, limit = 10, userId, status } = params;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.OrderWhereInput = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        where,
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      items: items as Order[],
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
        total,
      },
    };
  },
};