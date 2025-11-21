import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  
  if (!isAdmin) {
    redirect('/');
  }

  return session;
}
