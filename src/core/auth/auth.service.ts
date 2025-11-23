// core/auth/auth.service.ts
import { auth } from "@/lib/auth/auth";
import { registerUserDTO } from "@/lib/types/user.types";
import { prisma } from "@/db/client";

export const AuthService = {
  async register(data: unknown) {
    try {
      const validatedData = registerUserDTO.parse(data);

      const result = (await auth.api.signUpEmail({
        body: {
          email: validatedData.email,
          password: validatedData.password,
          name: `${validatedData.name} ${validatedData.surname}`,
        } as any,
      })) as any;

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
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new Error("Datos inválidos: " + error.errors[0].message);
      }

      if (error.message?.includes("already exists") || error.message?.includes("UNIQUE")) {
        throw new Error("Este correo electrónico ya está registrado");
      }

      throw new Error(error.message || "Error inesperado al registrar usuario");
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
    } catch (error: any) {
      if (error.message?.includes("Invalid") || error.message?.includes("incorrect")) {
        throw new Error("Email o contraseña incorrectos");
      }

      throw new Error(error.message || "Error al iniciar sesión");
    }
  },

};