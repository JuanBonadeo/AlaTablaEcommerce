'use server';

import { CategoryService } from '@/core/categories/categories.service';
import { revalidatePath } from 'next/cache';

export const getAllCategoriesAction = async () => {
  try {
    const result = await CategoryService.getAll();
    
    if (!result.success) {
      console.error('Error getting categories:', result.message);
      return [];
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error en getAllCategoriesAction:', error);
    return [];
  }
};

export const getCategoryByIdAction = async (id: string) => {
  try {
    const result = await CategoryService.getById(id);
    
    if (!result.success) {
      return null;
    }
    
    return result.data || null;
  } catch (error) {
    console.error('Error en getCategoryByIdAction:', error);
    return null;
  }
};

export const createCategoryAction = async (formData: FormData) => {
  try {
    const name = String(formData.get('name'));
    const result = await CategoryService.create(name);
    
    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo crear la categoría',
      };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/[id]');

    return {
      ok: true,
      category: result.data,
      message: result.message || 'Categoría creada exitosamente',
    };
  } catch (error) {
    console.error('Error en createCategoryAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al crear la categoría',
    };
  }
};

export const updateCategoryAction = async (id: string, formData: FormData) => {
  try {
    const name = String(formData.get('name'));
    const result = await CategoryService.update(id, name);

    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo actualizar la categoría',
      };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/[id]');

    return {
      ok: true,
      category: result.data,
      message: result.message || 'Categoría actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error en updateCategoryAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al actualizar la categoría',
    };
  }
};

export const deleteCategoryAction = async (id: string) => {
  try {
    const result = await CategoryService.delete(id);
    
    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo eliminar la categoría',
      };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products/new');
    revalidatePath('/admin/products/[id]');

    return {
      ok: true,
      message: result.message || 'Categoría eliminada exitosamente',
    };
  } catch (error) {
    console.error('Error en deleteCategoryAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al eliminar la categoría',
    };
  }
};