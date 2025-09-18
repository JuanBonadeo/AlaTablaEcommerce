import { prisma } from "src/db/client";

export const ProductDAO = {
  getAll: async () => {
    return prisma.product.findMany({
      include: { category: true, images: true, variants: true },
    });
  },

  getById: async (id: string) => {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, variants: true },
    });
  },

  create: async (data: {
    slug: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    images?: string[];
    variants?: { slug: string; name: string; price?: number; stock?: number }[];
  }) => {
    return prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        images: {
          create: data.images?.map((url) => ({ url })),
        },
        variants: {
          create: data.variants,
        },
      },
      include: { category: true, images: true, variants: true },
    });
  },

  update: async (id: string, data: any) => {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true, images: true, variants: true },
    });
  },

  delete: async (id: string) => {
    return prisma.product.delete({ where: { id } });
  },
};
