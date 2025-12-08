import { getAllUsersAction } from '@/lib/actions/user/user.actions';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const users = await getAllUsersAction();

  return <UsersClient users={users} />;
}
