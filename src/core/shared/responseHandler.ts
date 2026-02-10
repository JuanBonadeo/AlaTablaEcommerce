// core/responseHandler.ts






import { ApiResponse, ApiError } from "@/lib/types/shared.types";

export class ResponseHandler {
  // Métodos de éxito (siempre devuelven success: true)
  static success<T>(data: T, message = "Operación exitosa"): ApiResponse<T> {
    return { success: true, message, data };
  }

  static created<T>(data: T, message = "Recurso creado"): ApiResponse<T> {
    return { success: true, message, data };
  }

  static updated<T>(data: T, message = "Recurso actualizado"): ApiResponse<T> {
    return { success: true, message, data };
  }

  static deleted(message = "Recurso eliminado"): ApiResponse {
    return { success: true, message };
  }

  static error(message: string, status?: number): ApiError {
    return { success: false, message, status };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
    message = "Datos paginados obtenidos"
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / pageSize);
    return {
      success: true,
      message,
      data,
      pagination: { total, page, pageSize, totalPages },
    };
  }
}