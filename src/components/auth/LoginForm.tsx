"use client";

import Link from "next/link";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
}

export function LoginForm({ onSubmit, loading }: Props) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<Partial<LoginFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name as keyof LoginFormData]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El email no es válido";
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSubmit(formData);
  };

  const inputClass =
    "mt-1 appearance-none relative block w-xs md:w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm";

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={inputClass}
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.password}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-xs md:w-sm"
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/auth/register"
          className="font-medium text-red-600 hover:text-red-500"
        >
          ¿No tienes cuenta? Regístrate
        </Link>
      </div>
    </form>
  );
}