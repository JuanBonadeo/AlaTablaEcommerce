import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { Title } from "@/components/ui/Title";
import { requireAuth } from "@/lib/auth/require-auth";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default async function ChangePasswordPage() {
    await requireAuth();

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Link href="/profile" className="flex items-center text-gray-400 hover:text-orange-400 mb-6 sm:mb-8 transition-colors w-fit group">
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    Volver al perfil
                </Link>

                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/50">
                        <Lock size={28} />
                    </div>
                    <Title title="Cambiar Contraseña" size="3xl" className="mb-0" />
                </div>

                <div className="bg-gradient-to-br from-[#171718] to-[#0f0f10] rounded-2xl shadow-xl p-5 sm:p-8 mb-6 border-2 border-gray-800/50 hover:border-orange-500/20 transition-all duration-300">
                    <p className="text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base">
                        Ingresa tu contraseña actual y la nueva contraseña que deseas utilizar.
                    </p>
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
