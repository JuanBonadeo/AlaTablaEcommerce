"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

export function ResetPasswordForm() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
            });

            if (error) {
                setError(error.message || "Error al restablecer la contraseña. El enlace puede haber expirado.");
            } else {
                await authClient.signOut();
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            }
        } catch (err) {
            setError("Error inesperado al restablecer la contraseña");
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
                    <h2 className="text-2xl font-bold text-white mb-2">¡Contraseña actualizada!</h2>
                    <p className="text-gray-400">
                        Tu contraseña ha sido restablecida con éxito. Serás redirigido al inicio de sesión en unos segundos...
                    </p>
                </div>
                <div className="pt-4">
                    <Link
                        href="/auth/login"
                        className="btn-primary w-full inline-block text-center"
                    >
                        Ir al inicio de sesión ahora
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Nueva Contraseña</h2>
                <p className="text-gray-400">
                    Crea una nueva contraseña segura para tu cuenta.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="pass" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Nueva Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Lock size={18} />
                        </div>
                        <input
                            id="pass"
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full bg-[#171718] border border-gray-800 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Lock size={18} />
                        </div>
                        <input
                            id="confirm"
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full bg-[#171718] border border-gray-800 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all font-medium"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Restableciendo...
                        </>
                    ) : (
                        "Restablecer contraseña"
                    )}
                </button>
            </form>
        </div>
    );
}
