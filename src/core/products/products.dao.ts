import { Product } from "@prisma/client";
import { prisma } from "@db/client";
import { CreateProductInput, ProductList } from "@/lib/types/product.types";



import { Prisma } from '@prisma/client';

// Helper para incluir ofertas activas
const getOfferInclude = () => {
  const now = new Date();
  return {
    where: {
      deletedAt: null,
      desde: { lte: now },
      hasta: { gte: now },
    },
    take: 1,
    orderBy: { descuento: 'desc' as const },
    select: {
      id: true,
      descuento: true,
      descripcion: true,
      desde: true,
      hasta: true,
    },
  };
};

export const ProductDAO = {
  getAll: async () => {
    return prisma.product.findMany({
      where: { deletedAt: null },
      include: { 
        category: true, 
        images: true, 
        variants: true,
        offers: getOfferInclude(),
      },
    });
  },

  getByCategory: async (categoryName: string) => {
    return prisma.product.findMany({
      where: { 
        deletedAt: null,
        category: {
          name: {
            equals: categoryName,
            mode: 'insensitive',
          }
        }
      },
      include: { 
        category: true, 
        images: true, 
        variants: true,
        offers: getOfferInclude(),
      },
    });
  },

  getBySlug: async (slug: string) => {
    return prisma.product.findFirst({
      where: { slug: slug, deletedAt: null },
      include: { 
        category: true, 
        images: true, 
        variants: true,
        offers: getOfferInclude(),
      },
    });
  },
  
  getById: async (id: string)=> {
    return prisma.product.findFirst({
      where: { id: id, deletedAt: null },
      include: { 
        category: true, 
        images: true, 
        variants: true,
        offers: getOfferInclude(),
      },
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
      },
      
    });
  },

  update: async (id: string, data: Prisma.ProductUpdateInput): Promise<Product> => {
    return prisma.product.update({
      where: { id: id },
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
        select: { 
          id: true, 
          name: true, 
          slug: true, 
          price: true, 
          stock: true, 
          images: true, 
          category: true,
          offers: getOfferInclude(),
        },
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
