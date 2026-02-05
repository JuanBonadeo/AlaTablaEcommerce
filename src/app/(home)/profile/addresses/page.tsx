import { Title } from "@/components/ui/Title";
import { requireAuth } from "@/lib/auth/require-auth";
import { ProfileAddressesClient } from "./ui/ProfileAddressesClient";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default async function ProfileAddressesPage() {
    const session = await requireAuth();

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/profile" className="flex items-center text-gray-400 hover:text-orange-400 mb-6 sm:mb-8 transition-colors w-fit group">
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    Volver al perfil
                </Link>

                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/50">
                        <MapPin size={28} />
                    </div>
                    <Title title="Mis Direcciones" size="3xl" className="mb-0" />
                </div>

                <ProfileAddressesClient userId={session.user.id} />
            </div>
        </div>
    );
}
