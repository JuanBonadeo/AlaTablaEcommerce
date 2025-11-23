import { ProductVariant } from "@/lib/types/product.types";
import { ProductsVariantsDAO } from "./productsVariants.dao";

export const ProductsVariantsService = {
    getByProductId: async (productId: string) => {
        return ProductsVariantsDAO.getByProductId(productId);
    },

    create: async (data: ProductVariant) => {
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("El nombre es obligatorio");
        }
        return ProductsVariantsDAO.create(data);
    },
    update: async (id: string, data: Partial<ProductVariant>) => {
        const variant = await ProductsVariantsDAO.getById(id);
        if (!variant) {
            throw new Error("Variante no encontrada");
        }
        return await ProductsVariantsDAO.update(id, data)
    }
}
