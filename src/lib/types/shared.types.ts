import { z } from "zod";

export const cuidIdSchema = z.object({
  id: z.string().describe("ID inválido"),
});


export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: number;
  body: {
    success: false;
    message: string;
    code?: string;
    details?: any;
  };
}