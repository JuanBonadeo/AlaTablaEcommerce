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

export async function sendMarketingEmailAction(userIds: string[], subject: string, message: string) {
  try {
    // TODO: Implementar envío de emails
    // Por ahora solo retornamos éxito
    console.log('Sending marketing email to:', userIds, subject, message);
    
    return { 
      ok: true, 
      message: `Email enviado a ${userIds.length} usuario(s)` 
    };
  } catch (error) {
    console.error('Error en sendMarketingEmailAction:', error);
    return { ok: false, message: 'Error al enviar el email' };
  }
}
