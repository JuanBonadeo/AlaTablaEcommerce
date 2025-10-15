import z from "zod";

export const CategoryDTO = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres")
});

