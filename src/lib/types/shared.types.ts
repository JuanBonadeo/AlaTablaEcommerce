import { z } from "zod";

export const cuidIdSchema = z.object({
  id: z.string().describe("ID inválido"),
});


// Respuesta exitosa
export interface ApiResponse<T = void> {
  success: true;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Respuesta de error
export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: any;
  status?: number;
  body?: {
    success: false;
    message: string;
    code?: string;
    details?: any;
  };
}

// Union type para manejar ambos casos
export type ApiResult<T = void> = ApiResponse<T> | ApiError;

// Type guard para verificar si es un error
export function isApiError(result: ApiResult<any>): result is ApiError {
  return !result.success;
}

// Type guard para verificar si es exitoso
export function isApiSuccess<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success;
}