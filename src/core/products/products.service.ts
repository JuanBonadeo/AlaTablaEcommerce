import { ProductDAO } from "./products.dao";
import { CreateProductInput, CreateProductSchema, ListSearchParams, ListSearchParamsSchema, ProductWithoutSlug, UpdateProductInput, UpdateProductSchema } from "../../lib/types/product.types";
import { getSlug } from "../shared/getSlug";
import { ErrorHandler, NotFoundError } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";
import { cuidIdSchema } from "@/lib/types/shared.types";



export const ProductService = {
  getAll: async () => {
    try {
      const products = await ProductDAO.getAll();
      return ResponseHandler.success(products);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getBySlug: async (slug: string) => {
    try {
      const product = await ProductDAO.getBySlug(slug);
      if (!product) throw new NotFoundError()
      return ResponseHandler.success(product);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },
  getById: async (id: string) => {
    try {
      const product = await ProductDAO.getById(id);
      if (!product) throw new NotFoundError()
      return ResponseHandler.success(product);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  create: async (data: ProductWithoutSlug) => {
    try {
      const product = CreateProductSchema.parse(data);

      const slug = getSlug(product.name);
      const productWithSlug = { ...product, slug };

      const createdProduct = await ProductDAO.create(productWithSlug);
      return ResponseHandler.created(createdProduct);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  update: async (id: string, data: UpdateProductInput) => {
    try {
      cuidIdSchema.parse(id);
      const product = UpdateProductSchema.parse(data);

      const updatedProduct = await ProductDAO.update(id, product);
      return ResponseHandler.updated(updatedProduct);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  delete: async (id: string) => {
    try {

      await ProductDAO.delete(id);
      return ResponseHandler.deleted();
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },


  listProducts: async (params: ListSearchParams) => {
    const { page, limit } = ListSearchParamsSchema.parse(params);
    return ProductDAO.list(page, limit);
  },
};
