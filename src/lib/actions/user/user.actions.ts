'use server';

import { userService } from '@/core/services/user.service';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getAllUsersAction() {
  try {
    const users = await userService.getAllUsers();
    return users;
  } catch (error) {
    console.error('Error en getAllUsersAction:', error);
    return [];
  }
}

export async function getUserByIdAction(id: string) {
  try {
    const user = await userService.getUserById(id);
    return user;
  } catch (error) {
    console.error('Error en getUserByIdAction:', error);
    return null;
  }
}

export async function updateUserRoleAction(id: string, role: Role) {
  try {
    await userService.updateUserRole(id, role);
    revalidatePath('/admin/users');
    return { ok: true, message: 'Rol actualizado exitosamente' };
  } catch (error) {
    console.error('Error en updateUserRoleAction:', error);
    return { ok: false, message: error instanceof Error ? error.message : 'Error al actualizar el rol' };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await userService.deleteUser(id);
    revalidatePath('/admin/users');
    return { ok: true, message: 'Usuario eliminado exitosamente' };
  } catch (error) {
    console.error('Error en deleteUserAction:', error);
    return { ok: false, message: error instanceof Error ? error.message : 'Error al eliminar el usuario' };
  }
}

import { sendMarketingEmail } from '@/lib/email/resend';

export async function sendMarketingEmailAction(userIds: string[], subject: string, message: string) {
  try {
    const users = await userService.getUsersByIds(userIds);

    if (!users || users.length === 0) {
      return { ok: false, message: 'No se encontraron usuarios seleccionados' };
    }

    // Send emails (concurrently for better performance, but mind rate limits)
    const results = await Promise.allSettled(
      users.map(user =>
        sendMarketingEmail({
          email: user.email,
          name: user.name,
          subject,
          message
        })
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      ok: true,
      message: `Email enviado con éxito a ${successful} usuario(s).${failed > 0 ? ` Fallaron ${failed}.` : ''}`
    };
  } catch (error) {
    console.error('Error en sendMarketingEmailAction:', error);
    return { ok: false, message: 'Error al procesar el envío de emails' };
  }
}
