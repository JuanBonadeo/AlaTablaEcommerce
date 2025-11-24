import prisma from "@/db/client";
import { CreateOfferInput, UpdateOfferInput } from "@/lib/types/offer.types";

export class OfferDAO {
  static async create(data: CreateOfferInput) {
    return await prisma.offer.create({
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
          },
        },
      },
    });
  }

  static async getById(id: string) {
    return await prisma.offer.findUnique({
      where: { id, deletedAt: null },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  static async getAll() {
    return await prisma.offer.findMany({
      where: { deletedAt: null },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getByProductId(productId: string) {
    const now = new Date();
    return await prisma.offer.findFirst({
      where: {
        productId,
        deletedAt: null,
        desde: { lte: now },
        hasta: { gte: now },
      },
      orderBy: { descuento: "desc" }, // Retorna el descuento más alto si hay múltiples
    });
  }

  static async getActiveOffers() {
    const now = new Date();
    return await prisma.offer.findMany({
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
          },
        },
      },
    });
  }

  static async update(id: string, data: UpdateOfferInput) {
    return await prisma.offer.update({
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
          },
        },
      },
    });
  }

  static async delete(id: string) {
    // Soft delete
    return await prisma.offer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async hardDelete(id: string) {
    return await prisma.offer.delete({
      where: { id },
    });
  }
}
