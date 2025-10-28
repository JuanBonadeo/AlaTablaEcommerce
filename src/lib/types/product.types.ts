import { z } from "zod";

export interface ProductGridItem {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images: { id: string; url: string; productId: string }[];
    category?: { id: string; name: string }; // Agregado
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  // category.slug puede no estar presente en algunas consultas, lo marcamos opcional
  category?: { id: string; name: string; slug?: string } | null;
  images?: { id: string; url: string; productId: string }[] | string[];
  variants?: Array<{
    id: string;
    slug: string;
    name: string;
    price?: number;
    stock?: number;
    productId: string;
  }>;
}
export interface ProductVariant {
  id?: string;
  slug?: string;
  name?: string;
  price?: number;
  stock?: number;
  productId?: string;
}

export const CreateProductSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  categoryId: z.string().min(1, "Debe seleccionar una categoría"),
  // images can be either base64 strings (sent from the client) or URLs (after upload).
  images: z.array(z.string()).describe("Imagenes del producto"),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, "El nombre de la variante es requerido"),
        // slug can be generated server-side if missing from the client
        slug: z.string().min(1, "El slug de la variante es requerido").optional(),
        price: z.number().min(0, "El precio debe ser mayor o igual a 0").optional(),
        stock: z.number().int().min(0, "El stock no puede ser negativo").optional(),
      })
    ).describe("Variantes del producto")
    .optional(),
});

const createdproduct = CreateProductSchema.extend({
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
})

export const UpdateProductSchema = CreateProductSchema.partial()

export type ProductWithoutSlug = z.infer<typeof CreateProductSchema>;
export type CreateProductInput = z.infer<typeof createdproduct>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const ListSearchParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(20).default(10).optional(),
});
export type ListSearchParams = z.infer<typeof ListSearchParamsSchema>;

export interface ProductList {
    items: ProductGridItem[];
    pagination: {
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}