import { prisma } from "@/db/client";
import { Category } from "@prisma/client";

export const CategoriesDAO = {
  getAll: async (): Promise<Category[]> => {
    return prisma.category.findMany();
  },

  getById: async (id: string): Promise<Category | null> => {
    return prisma.category.findUnique({
      where: { id },
      include: { products: {
        include: { variants: true, images: true },
      } },
    });
  },

  create: async (name: string): Promise<Category> => {
    return prisma.category.create({
      data: { name },
    });
  },

  update: async (id: string, name: string): Promise<Category> => {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  delete: async (id: string): Promise<Category> => {
    return prisma.category.delete({
      where: { id },
    });
  },
};
