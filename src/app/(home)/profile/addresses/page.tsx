import { Title } from "@/components/ui/Title";
import { requireAuth } from "@/lib/auth/require-auth";
import { ProfileAddressesClient } from "./ui/ProfileAddressesClient";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default async function ProfileAddressesPage() {
    const session = await requireAuth();

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/profile" className="flex items-center text-gray-400 hover:text-orange-400 mb-8 transition-colors w-fit">
                    <ArrowLeft className="mr-2" size={20} />
                    Volver al perfil
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-orange-400/10 rounded-full">
                        <MapPin className="text-orange-400" size={32} />
                    </div>
                    <Title title="Mis Direcciones" size="3xl" className="mb-0" />
                </div>

                <ProfileAddressesClient userId={session.user.id} />
            </div>
        </div>
    );
}
