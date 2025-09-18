// packages/core/shared/responseHandler.ts

import { logger } from "./logger.js";


interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export class ResponseHandler {
  private static logResponse<T>(
    status: number,
    message: string,
    data?: T,
    additionalData?: any
  ) {
    const dataSize = data ? JSON.stringify(data).length : 0;

    logger.info("Response sent", {
      response: {
        status,
        message,
        dataSize,
        timestamp: new Date().toISOString(),
      },
      ...additionalData,
    });
  }

  static success<T>(
    data: T,
    message = "Operación exitosa",
    status = 200
  ): { body: ApiResponse<T>; status: number } {
    this.logResponse(status, message, data);

    return {
      status,
      body: {
        success: true,
        message,
        data,
      },
    };
  }

  static created<T>(
    data: T,
    message = "Recurso creado"
  ): { body: ApiResponse<T>; status: number } {
    return this.success(data, message, 201);
  }

  static updated<T>(
    data: T,
    message = "Recurso actualizado"
  ): { body: ApiResponse<T>; status: number } {
    return this.success(data, message, 200);
  }

  static deleted(
    message = "Recurso eliminado"
  ): { body: ApiResponse<null>; status: number } {
    this.logResponse(204, message);

    return {
      status: 204,
      body: {
        success: true,
        message,
      },
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
    message = "Datos paginados obtenidos"
  ): { body: ApiResponse<T[]>; status: number } {
    const totalPages = Math.ceil(total / pageSize);

    this.logResponse(200, message, data, {
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        recordsCount: data.length,
      },
    });

    return {
      status: 200,
      body: {
        success: true,
        message,
        data,
        pagination: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },
    };
  }
}
