"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserDTO } from "@/lib/types/user.types";

interface RegisterFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string; // solo para verificación local
  phone: string;
}

interface Props {
  onSubmit: (data: createUserDTO) => Promise<void>;
  loading: boolean;
}

export function RegisterForm({ onSubmit, loading }: Props) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<RegisterFormData>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof RegisterFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<RegisterFormData> = {};

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.surname.trim()) {
      errors.surname = "El apellido es requerido";
    } else if (formData.surname.trim().length < 3) {
      errors.surname = "El apellido debe tener al menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      errors.email = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El correo electrónico no es válido";
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.phone.trim()) {
      errors.phone = "El teléfono es requerido";
    } else if (formData.phone.trim().length < 10) {
      errors.phone = "El teléfono debe tener al menos 10 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...dataToSubmit } = formData;
    await onSubmit(dataToSubmit);
  };

  const inputClass =
    "mt-1 appearance-none relative block w-xs md:w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm";

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={inputClass}
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="surname" className="block text-sm font-medium">
            Apellido
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            className={inputClass}
            placeholder="Tu apellido"
            value={formData.surname}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.surname && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.surname}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Correo electrónico
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
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            className={inputClass}
            placeholder="Ej: 3411234567"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
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
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={inputClass}
            placeholder="Confirma tu contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.confirmPassword}
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
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="font-medium text-red-600 hover:text-red-500"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </form>
  );
}
