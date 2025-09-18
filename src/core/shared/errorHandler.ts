// packages/core/shared/errorHandler.ts
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { logger } from "./logger";

// ==== Custom Errors ====
export class NotFoundError extends Error {
  constructor(message = "Recurso no encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}
export class BadRequestError extends Error {
  constructor(message = "Solicitud inválida") {
    super(message);
    this.name = "BadRequestError";
  }
}
export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
export class ForbiddenError extends Error {
  constructor(message = "Acceso prohibido") {
    super(message);
    this.name = "ForbiddenError";
  }
}
export class ConflictError extends Error {
  constructor(message = "Conflicto de datos") {
    super(message);
    this.name = "ConflictError";
  }
}

// ==== ApiError shape ====
export interface ApiError {
  status: number;
  body: {
    success: false;
    message: string;
    code?: string;
    details?: any;
  };
}

export class ErrorHandler {
  private static prismaErrorMessages: Record<string, ApiError> = {
    P2002: { status: 409, body: { success: false, message: "Violación de restricción única", code: "P2002" } },
    P2003: { status: 400, body: { success: false, message: "Clave foránea no válida", code: "P2003" } },
    P2025: { status: 404, body: { success: false, message: "Registro no encontrado", code: "P2025" } },
  };

  static format(error: unknown): ApiError {
    // Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return (
        this.prismaErrorMessages[error.code] || {
          status: 500,
          body: {
            success: false,
            message: "Error de base de datos desconocido",
            code: error.code,
            details: error.meta,
          },
        }
      );
    }

    // Zod
    if (error instanceof ZodError) {
      return {
        status: 400,
        body: {
          success: false,
          message: "Datos de entrada inválidos",
          code: "ZOD_VALIDATION_ERROR",
          details: error.issues.map((i) => ({
            field: i.path.join(".") || "root",
            message: i.message,
            code: i.code,
          })),
        },
      };
    }

    // Custom Errors
    if (error instanceof NotFoundError) return { status: 404, body: { success: false, message: error.message, code: "NOT_FOUND" } };
    if (error instanceof BadRequestError) return { status: 400, body: { success: false, message: error.message, code: "BAD_REQUEST" } };
    if (error instanceof UnauthorizedError) return { status: 401, body: { success: false, message: error.message, code: "UNAUTHORIZED" } };
    if (error instanceof ForbiddenError) return { status: 403, body: { success: false, message: error.message, code: "FORBIDDEN" } };
    if (error instanceof ConflictError) return { status: 409, body: { success: false, message: error.message, code: "CONFLICT" } };

    // Default
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    logger.error("Unhandled error", { error });
    return { status: 500, body: { success: false, message, code: "INTERNAL_SERVER_ERROR" } };
  }
}

