import { z } from "zod";

// =========================
// CORREO ARGENTINO TYPES
// =========================

export enum ShippingCarrier {
  CORREO_ARGENTINO = "CORREO_ARGENTINO",
  ANDREANI = "ANDREANI",
  OCA = "OCA",
  ENTREGA_LOCAL = "ENTREGA_LOCAL",
}

export enum ShippingService {
  // Correo Argentino
  CLASICO = "CLASICO",
  EXPRESO = "EXPRESO",
  PRIORITARIO = "PRIORITARIO",
  ROSARIO_LOCAL = "ROSARIO_LOCAL",
}

export interface ShippingQuoteRequest {
  originZipCode: string;
  destinationZipCode: string;
  weight: number; // en gramos
  length?: number; // en cm
  width?: number; // en cm
  height?: number; // en cm
  declaredValue?: number; // valor declarado para seguro
}

export interface ShippingQuoteResponse {
  carrier: ShippingCarrier;
  service: ShippingService;
  serviceName: string;
  cost: number;
  estimatedDays: number;
  additionalInfo?: string;
}

export interface CorreoArgentinoQuoteRequest {
  codigoPostalOrigen: string;
  codigoPostalDestino: string;
  peso: number; // en gramos
  largo?: number;
  ancho?: number;
  alto?: number;
  valorDeclarado?: number;
}

export interface CorreoArgentinoTarifa {
  tipo_servicio: string;
  nombre_servicio: string;
  precio: number;
  dias_entrega: number;
  adicionales?: {
    seguro?: number;
    embalaje?: number;
  };
}

export interface CorreoArgentinoQuoteResponse {
  status: string;
  tarifas: CorreoArgentinoTarifa[];
  mensaje?: string;
}

// =========================
// ZOD SCHEMAS
// =========================

export const ShippingQuoteRequestSchema = z.object({
  originZipCode: z.string().min(4, "Código postal de origen requerido"),
  destinationZipCode: z.string().min(4, "Código postal de destino requerido"),
  weight: z.number().positive("El peso debe ser mayor a 0"),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  declaredValue: z.number().positive().optional(),
});

export type ValidatedShippingQuoteRequest = z.infer<typeof ShippingQuoteRequestSchema>;

// =========================
// CART SHIPPING TYPES
// =========================

export interface CartShippingCalculation {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  destinationZipCode: string;
}

export const CartShippingCalculationSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().positive(),
  })),
  destinationZipCode: z.string().min(4),
});
