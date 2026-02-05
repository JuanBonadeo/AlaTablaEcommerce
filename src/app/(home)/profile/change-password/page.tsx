import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { Title } from "@/components/ui/Title";
import { requireAuth } from "@/lib/auth/require-auth";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default async function ChangePasswordPage() {
    await requireAuth();

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Link href="/profile" className="flex items-center text-gray-400 hover:text-orange-400 mb-8 transition-colors w-fit">
                    <ArrowLeft className="mr-2" size={20} />
                    Volver al perfil
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-orange-400/10 rounded-full">
                        <Lock className="text-orange-400" size={32} />
                    </div>
                    <Title title="Cambiar Contraseña" size="3xl" className="mb-0" />
                </div>

                <div className="bg-[#171718] rounded-xl shadow-lg p-8 mb-6 border border-gray-800">
                    <p className="text-gray-400 mb-8 text-center">
                        Ingresa tu contraseña actual y la nueva contraseña que deseas utilizar.
                    </p>
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
