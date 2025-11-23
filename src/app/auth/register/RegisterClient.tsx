// components/auth/RegisterClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUserDTO } from "@/lib/types/user.types";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { authClient } from "@/lib/auth/auth-client";

export function RegisterClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (formData: registerUserDTO) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.name} ${formData.surname}`,
      });

      if (authError) {
        setError(authError.message || "Error al registrar usuario");
        return;
      }

      if (data) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h flex items-center justify-center bg rounded-xl py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">¡Registro exitoso!</p>
            <p className="text-sm mt-2">
              Hemos enviado un email de verificación a tu correo.
            </p>
            <p className="text-sm mt-1">
              Por favor, revisa tu bandeja de entrada y sigue el enlace para verificar tu cuenta.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="mt-4 text-sm text-green-800 hover:underline font-medium"
            >
              Ir al login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h flex items-center justify-center bg rounded-xl py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <h2 className="text-center text-3xl font-extrabold">Crear cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para comenzar
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}

        <RegisterForm onSubmit={handleRegister} loading={loading} />
      </div>
    </div>
  );
}