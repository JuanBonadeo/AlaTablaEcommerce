import { ProductDAO } from "./products.dao";
import { CreateProductSchema, ListSearchParams, ListSearchParamsSchema, ProductWithoutSlug, UpdateProductInput, UpdateProductSchema } from "../../lib/types/product.types";
import { getSlug } from "../shared/getSlug";
import { ErrorHandler, NotFoundError } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";
import { uploadImages } from "@/lib/actions/images/uploadImagesToCloudinary";
import { Prisma } from "@prisma/client";



export const ProductService = {
  getAll: async () => {
    try {
      const products = await ProductDAO.getAll();
      return ResponseHandler.success(products);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getByCategory: async (categoryName: string) => {
    try {
      const products = await ProductDAO.getByCategory(categoryName);
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

      if (product.images && product.images.length > 0) {
        // Upload only base64 images and preserve existing URLs
        const isUrl = (s: string) => /^https?:\/\//i.test(s);
        const toUpload = product.images.filter((img) => !isUrl(img));
        if (toUpload.length > 0) {
          const uploaded = await uploadImages(toUpload);
          if (!uploaded) throw new Error('Error uploading images');
          let idx = 0;
          product.images = product.images.map((img) => (isUrl(img) ? img : (uploaded[idx++] as string)));
        }
      }
      // Ensure variants have slugs (generate from name if missing)
      if (product.variants && product.variants.length > 0) {
        product.variants = product.variants.map((v) => ({
          ...v,
          slug: v.slug || getSlug(String(v.name)),
        }));
      }
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
      const product = UpdateProductSchema.parse(data);

      // Prepare nested writes for relations (images, variants) because Prisma expects objects
      // Exclude images and variants from the spread as they need special handling
      const { images, variants, ...productData } = product;
      const updateData: Prisma.ProductUpdateInput = { ...productData };

      // If name is being updated, regenerate the slug
      if (product.name) {
        const slug = getSlug(product.name);
        updateData.slug = slug;
      }

      if (images) {
        const isUrl = (s: string) => /^https?:\/\//i.test(s);
        const toUpload = images.filter((img) => !isUrl(img));
        if (toUpload.length > 0) {
          const uploaded = await uploadImages(toUpload);
          if (!uploaded) throw new Error('Error uploading images');
          let idx = 0;
          const processedImages = images.map((img) => (isUrl(img) ? img : (uploaded[idx++] as string)));

          // Replace existing images with provided ones (create new rows)
          updateData.images = {
            deleteMany: {},
            create: processedImages.map((url) => ({ url })),
          };
        } else {
          // All images are URLs, just update them
          updateData.images = {
            deleteMany: {},
            create: images.map((url) => ({ url })),
          };
        }
      }

      // Only update variants when the client explicitly provides at least one variant.
      // This avoids accidentally deleting all existing variants when the client sends an empty array.
      if (variants && variants.length > 0) {
        updateData.variants = {
          deleteMany: {},
          create: variants.map((v) => ({
            name: v.name as string,
            price: v.price ?? null,
            stock: v.stock ?? null,
            slug: v.slug || getSlug(String(v.name)),
          })),
        };
      }

      const updatedProduct = await ProductDAO.update(id, updateData);
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
