import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers.js";


import { redirect } from "next/navigation";

export default async function CheckoutLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user) {
        redirect("/auth/login?redirectTo=/checkout/address");
    }

    return (
        <>
            {children}
        </>
    );
}