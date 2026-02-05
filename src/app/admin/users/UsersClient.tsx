'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Search, Shield, ShieldCheck, User as UserIcon, Trash2, Calendar, ShoppingBag } from 'lucide-react';
import { updateUserRoleAction, deleteUserAction } from '@/lib/actions/user/user.actions';
import { Role } from '@/lib/types/enums';
import EmailMarketingModal from './EmailMarketingModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

type UserData = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  phone: string | null;
  createdAt: Date;
  _count: {
    orders: number;
  };
};

interface UsersClientProps {
  users: UserData[];
}

export default function UsersClient({ users }: UsersClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<(() => Promise<void>) | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setConfirmMessage('¿Estás seguro de cambiar el rol de este usuario?');
    setOnConfirmAction(() => async () => {
      setIsUpdating(true);
      try {
        const result = await updateUserRoleAction(userId, newRole);
        if (result.ok) {
          router.refresh();
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Error al actualizar el rol');
      } finally {
        setIsUpdating(false);
        setConfirmOpen(false);
        setOnConfirmAction(null);
      }
    });
    setConfirmOpen(true);
  };

  const handleDelete = async (userId: string) => {
    setConfirmMessage('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.');
    setOnConfirmAction(() => async () => {
      setIsUpdating(true);
      try {
        const result = await deleteUserAction(userId);
        if (result.ok) {
          router.refresh();
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Error al eliminar el usuario');
      } finally {
        setIsUpdating(false);
        setConfirmOpen(false);
        setOnConfirmAction(null);
      }
    });
    setConfirmOpen(true);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const getRoleBadge = (role: Role) => {
    const styles = {
      ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      USER: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    };

    const icons = {
      ADMIN: <ShieldCheck size={14} />,
      USER: <UserIcon size={14} />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium ${styles[role]}`}>
        {icons[role]}
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Usuarios</h1>
          <p className="text-gray-400">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => setShowEmailModal(true)}
          disabled={selectedUsers.length === 0}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Mail size={18} />
          Email Marketing ({selectedUsers.length})
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-[#0a0a0a]">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-orange-500"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Usuario</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Rol</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pedidos</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Registro</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-orange-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        {user.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">{user.email}</span>
                      {user.emailVerified && (
                        <span className="text-green-500 text-xs">✓ Verificado</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                      disabled={isUpdating}
                      className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-gray-300">
                      <ShoppingBag size={16} className="text-gray-500" />
                      <span>{user._count.orders}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isUpdating}
                      className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      title="Eliminar usuario"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </div>

      {/* Email Marketing Modal */}
      {showEmailModal && (
        <EmailMarketingModal
          selectedUserIds={selectedUsers}
          onClose={() => setShowEmailModal(false)}
        />
      )}
      <ConfirmModal
        open={confirmOpen}
        title="Confirmar"
        message={confirmMessage}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        loading={isUpdating}
        onConfirm={() => { onConfirmAction && onConfirmAction(); }}
        onCancel={() => { setConfirmOpen(false); setOnConfirmAction(null); }}
      />
    </div>
  );
}
