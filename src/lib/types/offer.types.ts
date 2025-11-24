import { z } from "zod";

export interface Offer {
  id: string;
  productId: string;
  descuento: number;
  descripcion: string | null;
  desde: Date;
  hasta: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const CreateOfferSchema = z.object({
  productId: z.string().min(1, "Debe seleccionar un producto"),
  descuento: z.number().min(0, "El descuento debe ser mayor o igual a 0").max(100, "El descuento no puede ser mayor a 100%"),
  descripcion: z.string().optional(),
  desde: z.date({ required_error: "La fecha de inicio es requerida" }),
  hasta: z.date({ required_error: "La fecha de fin es requerida" }),
}).refine((data) => data.hasta > data.desde, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["hasta"],
});

export const UpdateOfferSchema = CreateOfferSchema.partial();

export type CreateOfferInput = z.infer<typeof CreateOfferSchema>;
export type UpdateOfferInput = z.infer<typeof UpdateOfferSchema>;
