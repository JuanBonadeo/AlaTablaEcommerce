import { prisma } from "src/db/client.js";
import { ProductVariant } from "src/shared/types/shared.types.js";
import async from '../../../../.next/types/routes';

export const ProductsVariantsDAO = {
    getByProductId: async (productId: string) => {
        return prisma.productVariant.findMany({
            where: {
                productId: productId
            }
        });
    },
    create: async (data: ProductVariant) => {
        return prisma.productVariant.create({
            data: {
                ...data,
            }
        });
    },
    update: async (id: string, data: Partial<ProductVariant>) => {
        return prisma.productVariant.update({
            where: {
                id: id
            },
            data: {
                ...data,
            }
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