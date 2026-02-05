"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Asegurar que no haya sesiones activas o tokens viejos al iniciar el flujo
        authClient.signOut();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await authClient.forgetPassword({
                email,
                redirectTo: "/auth/reset-password",
            });

            if (error) {
                setError(error.message || "Error al enviar el correo de recuperación");
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("Error inesperado al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="flex justify-center">
                    <div className="p-4 bg-green-500/10 rounded-full">
                        <CheckCircle2 className="text-green-500" size={48} />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">¡Correo enviado!</h2>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada.
                    </p>
                </div>
                <div className="pt-4">
                    <Link
                        href="/auth/login"
                        className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h2>
                <p className="text-gray-400">
                    No te preocupes. Ingresa tu correo y te enviaremos instrucciones para restablecerla.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Mail size={18} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full bg-[#171718] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all font-medium"
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !email}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Enviando...
                        </>
                    ) : (
                        "Enviar instrucciones"
                    )}
                </button>
            </form>

            <div className="text-center pt-2">
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
}
