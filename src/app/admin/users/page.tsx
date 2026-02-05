import { getAllUsersAction } from '@/lib/actions/user/user.actions';

export const dynamic = 'force-dynamic';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const users = await getAllUsersAction();

  return <UsersClient users={users} />;
}
