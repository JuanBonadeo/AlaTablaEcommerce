// core/auth/auth.service.ts
import { auth } from "@/lib/auth/auth";
import { registerUserDTO } from "@/lib/types/user.types";
import { prisma } from "@/db/client";

export const AuthService = {
  async register(data: unknown) {
    try {
      const validatedData = registerUserDTO.parse(data);

      const result = await auth.api.signUpEmail({
        body: {
          email: validatedData.email,
          password: validatedData.password,
          name: `${validatedData.name} ${validatedData.surname}`,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      if (!result) {
        throw new Error("Error al registrar usuario");
      }

      // Actualizar campos adicionales como phone
      if (validatedData.phone && result.user) {
        await prisma.user.update({
          where: { id: result.user.id },
          data: { phone: validatedData.phone },
        });
      }

      return result.user;
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === "ZodError" && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        throw new Error("Datos inválidos: " + zodError.errors[0].message);
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("already exists") || errorMessage.includes("UNIQUE")) {
        throw new Error("Este correo electrónico ya está registrado");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error((error as any).message || "Error inesperado al registrar usuario");
    }
  },

  async login(email: string, password: string) {
    try {
      if (!email || !password) {
        throw new Error("Email y contraseña son requeridos");
      }

      // 👇 Con nextCookies(), esto setea la cookie automáticamente
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      if (!result) {
        throw new Error("Credenciales inválidas");
      }

      return result.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("Invalid") || errorMessage.includes("incorrect")) {
        throw new Error("Email o contraseña incorrectos");
      }

      throw new Error(errorMessage || "Error al iniciar sesión");
    }
  },

};