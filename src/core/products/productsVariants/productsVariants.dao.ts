import { prisma } from "@/db/client";
import { ProductVariant } from "@/lib/types/product.types";

export const ProductsVariantsDAO = {
    getByProductId: async (productId: string) => {
        return prisma.productVariant.findMany({
            where: {
                productId: productId
            }
        });
    },
    getById: async (id: string) => {
        return prisma.productVariant.findUnique({
            where: {
                id: id
            }
        });
    },
    create: async (data: ProductVariant) => {
        return prisma.productVariant.create({
            data: data as any,
        });
    },
    update: async (id: string, data: Partial<ProductVariant>) => {
        return prisma.productVariant.update({
            where: {
                id: id
            },
            data: data as any,
        });
    },
    delete: async (id: string) => {
        return prisma.productVariant.delete({
            where: {
                id: id
            }
        });
    }
}