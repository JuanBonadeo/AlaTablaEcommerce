import { prisma } from "@/db/client";
import { CreateOfferInput, UpdateOfferInput } from "@/lib/types/offer.types";

export const OfferDAO = {
  create: async (data: CreateOfferInput) => {
    return prisma.offer.create({
      data: {
        productId: data.productId,
        descuento: data.descuento,
        descripcion: data.descripcion || null,
        desde: data.desde,
        hasta: data.hasta,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
      },
    });
  },

  getById: async (id: string) => {
    return prisma.offer.findUnique({
      where: { id, deletedAt: null },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
      },
    });
  },

  getAll: async () => {
    return prisma.offer.findMany({
      where: { deletedAt: null },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getByProductId: async (productId: string) => {
    const now = new Date();
    return prisma.offer.findFirst({
      where: {
        productId,
        deletedAt: null,
        desde: { lte: now },
        hasta: { gte: now },
      },
      orderBy: { descuento: "desc" },
    });
  },

  getActiveOffers: async () => {
    const now = new Date();
    return prisma.offer.findMany({
      where: {
        deletedAt: null,
        desde: { lte: now },
        hasta: { gte: now },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  update: async (id: string, data: UpdateOfferInput) => {
    return prisma.offer.update({
      where: { id },
      data: {
        ...(data.productId && { productId: data.productId }),
        ...(data.descuento !== undefined && { descuento: data.descuento }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.desde && { desde: data.desde }),
        ...(data.hasta && { hasta: data.hasta }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.offer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  hardDelete: async (id: string) => {
    return prisma.offer.delete({
      where: { id },
    });
  },
};

