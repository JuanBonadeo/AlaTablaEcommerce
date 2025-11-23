import { z } from "zod";

export const CreateAddressSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  street: z.string().min(3, "La dirección es requerida"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "La provincia o estado es requerido"),
  zip: z.string().min(3, "El código postal es requerido"),
  phone: z.string().min(6, "El teléfono es requerido"),
  isDefault: z.boolean().optional().default(false),
  userId: z.string().min(1, "El ID de usuario es requerido"),
});

export interface Address extends z.infer<typeof CreateAddressSchema> {
  id: string;
}

export type CreateAddress = z.infer<typeof CreateAddressSchema>;

export type UpdateAddress = Partial<CreateAddress>;