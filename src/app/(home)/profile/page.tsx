import { LogoutBtn } from "@/components/auth/LogoutBtn";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
  return (
    <div>
      <h1>{session?.user?.name}</h1>
        <p>{session?.user?.email}</p>
        <pre>{JSON.stringify(session, null, 2)}</pre>

        <LogoutBtn />
    </div>
  );
}