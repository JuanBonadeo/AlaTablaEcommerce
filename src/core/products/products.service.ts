import { Product } from "@prisma/client";
import { ProductDAO } from "./products.dao";
import { ProductInput } from "./products.dtos.js";

export const ProductService = {
  getAll: async () => {
    return ProductDAO.getAll();
  },

  getById: async (id: string) => {
    const product = await ProductDAO.getById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  },

  create: async (data: ProductInput) => {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("El nombre es obligatorio");
    }
    if (data.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (data.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }
    if (!data.categoryId) {
      throw new Error("El producto debe pertenecer a una categoría");
    }

    return ProductDAO.create(data);
  },

  update: async (id: string, data: Partial<{
    slug: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
  }>) => {
    const product = await ProductDAO.getById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (data.price !== undefined && data.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    return ProductDAO.update(id, data);
  },

  delete: async (id: string) => {
    const product = await ProductDAO.getById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return ProductDAO.delete(id);
  },
};
