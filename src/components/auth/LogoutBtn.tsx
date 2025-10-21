"use client";

import { authClient } from "@/lib/auth/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const LogoutBtn = () => {
    const router = useRouter();
    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/auth/login");
    };

    return (
        <button onClick={handleLogout} className="btn-primary flex items-center gap-2 ">
            <LogOutIcon className="w-5 h-5" />
            Logout
        </button>
    );
}
