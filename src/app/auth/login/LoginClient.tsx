"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { loginUserAction } from "@/lib/actions/auth/auth.actions";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (formData: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginUserAction(formData);

      if (result.success) {
        router.push("/");
        router.refresh(); // 👈 Importante para actualizar la sesión en el cliente
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h flex items-center justify-center bg rounded-xl py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <h2 className="text-center text-3xl font-extrabold">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}

        <LoginForm onSubmit={handleLogin} loading={loading} />
      </div>
    </div>
  );
}