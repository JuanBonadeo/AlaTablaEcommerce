import { Product } from "@prisma/client";
import { prisma } from "@db/client";
import { CreateProductInput, ProductList } from "@/lib/types/product.types";



export const ProductDAO = {
  getAll: async () => {
    return prisma.product.findMany({
      where: { deletedAt: null },
      include: { category: true, images: true, variants: true },
    });
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    return prisma.product.findUnique({
      where: { slug: slug,
        deletedAt: null
       },
      include: { category: true, images: true, variants: true },
    });
  },
  getById: async (id: string): Promise<Product | null> => {
    return prisma.product.findUnique({
      where: { id: id, deletedAt: null },
      include: { category: true, images: true, variants: true },
    });
  },

  create: async (data: CreateProductInput) : Promise<Product> => {
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
      
    });
  },

  update: async (id: string, data: any): Promise<Product> => {
    return prisma.product.update({
      where: { id: id, deletedAt: null },
      data,
      include: { category: true, images: true, variants: true },
    });
  },

  delete: async (id: string): Promise<Product> => {
    return await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  list: async (page = 1, limit = 10): Promise<ProductList> => {
    const skip = (page - 1) * limit;
    const take = limit;
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        skip, 
        take,
        select: { id: true, name: true, slug: true, price: true, stock: true, images: true, category: true },
      }),
      prisma.product.count(),
    ]);
    return { 
      items,
      pagination : {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      }
      };
  }
};
