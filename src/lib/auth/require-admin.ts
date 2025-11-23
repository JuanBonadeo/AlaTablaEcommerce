import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface UserWithRole {
  role?: string;
}

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const isAdmin = (session?.user as UserWithRole)?.role === 'ADMIN';
  
  if (!isAdmin) {
    redirect('/');
  }

  return session;
}
