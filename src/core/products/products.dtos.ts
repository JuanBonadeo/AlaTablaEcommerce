import z from "zod";

export const ProductDTO = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
    description: z.string().optional(), 
    price: z.number().positive("El precio debe ser un número positivo"),
    stock: z.number().min(0, "El stock no puede ser negativo"),
    categoryId: z.string().uuid("El ID de la categoría debe ser un UUID"),
    images: z.array(z.string().url("Cada imagen debe ser una URL válida")).optional(),
    variants: z.array(z.object({
        name: z.string().min(3, "El nombre de la variante debe tener al menos 3 caracteres"),
        slug: z.string().min(3, "El slug de la variante debe tener al menos 3 caracteres").optional(),
        price: z.number().positive("El precio de la variante debe ser un número positivo").optional(),
        stock: z.number().min(0, "El stock de la variante no puede ser negativo").optional(),
    })).optional(),
});

export type ProductInput = z.infer<typeof ProductDTO>;

