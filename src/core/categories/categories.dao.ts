import { prisma } from "src/db/client";


export const CategoriesDAO = {
  getAll: async () => {
    return prisma.category.findMany();
  },

  getById: async (id: string) => {
    return prisma.category.findUnique({
      where: { id },
      include: { products: {
        include: { variants: true, images: true },
      } },
    });
  },

  create: async (name: string) => {
    return prisma.category.create({
      data: { name },
    });
  },

  update: async (id: string, name: string) => {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  delete: async (id: string) => {
    return prisma.category.delete({
      where: { id },
    });
  },
};
