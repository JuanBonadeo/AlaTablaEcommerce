"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

// Actually, I didn't check for a toast utility. Let me standardise on local state for error/success messages first to be safe,
// similar to LoginForm validatonErrors.

export function ChangePasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: "Las contraseñas nuevas no coinciden" });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: "La contraseña debe tener al menos 8 caracteres" });
      return;
    }

    setLoading(true);

    try {
      await authClient.changePassword({
        newPassword: formData.newPassword,
        currentPassword: formData.currentPassword,
        revokeOtherSessions: true, // Optional security measure
      }, {
        onRequest: () => {
          // Optional: start loading
        },
        onSuccess: () => {
          setMessage({ type: 'success', text: "Contraseña actualizada exitosamente" });
          setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
        },
        onError: (ctx) => {
          setMessage({ type: 'error', text: ctx.error.message || "Error al actualizar la contraseña" });
        }
      });
    } catch (error) {
      // Only catches unexpected errors, better-auth usually handles it in onError
      console.error(error);
      setMessage({ type: 'error', text: "Ocurrió un error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-800 bg-[#0a0a0a] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
          Contraseña Actual
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          value={formData.currentPassword}
          onChange={handleChange}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
          Nueva Contraseña
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          value={formData.newPassword}
          onChange={handleChange}
          className={inputClass}
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
          Confirmar Nueva Contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className={inputClass}
          placeholder="Repite la nueva contraseña"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-900/20 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-primary"
        >
          {loading ? "Actualizando..." : "Cambiar Contraseña"}
        </button>
      </div>
    </form>
  );
}
