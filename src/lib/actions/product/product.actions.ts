'use server';

import { CategoryService } from '@/core/categories/categories.service';
import { ProductService } from '@/core/products/products.service';
import { revalidatePath } from 'next/cache';

function mapFormDataToProduct(formData: FormData) {
  const imagesStr = formData.get("images") as string | null;
  const variantsStr = formData.get("variants") as string | null;

  // images are sent as a JSON stringified array from the client (base64 strings)
  let images: string[] = [];
  if (imagesStr) {
    try {
      images = JSON.parse(imagesStr);
    } catch (err) {
      // fallback: if it's not valid JSON, try splitting (legacy)
      images = imagesStr.split(',').map(url => url.trim()).filter(Boolean);
    }
  }

  return {
    name: String(formData.get("name")),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    weight: formData.get("weight") ? Number(formData.get("weight")) : undefined,
    length: formData.get("length") ? Number(formData.get("length")) : undefined,
    width: formData.get("width") ? Number(formData.get("width")) : undefined,
    height: formData.get("height") ? Number(formData.get("height")) : undefined,
    categoryId: String(formData.get("categoryId")),
    images,
    description: formData.get("description") ? String(formData.get("description")) : undefined,
    variants: variantsStr ? JSON.parse(variantsStr) : undefined,
  };
}

export const createProductAction = async (formData: FormData) => {
  try {
    const data = mapFormDataToProduct(formData);
    const result = await ProductService.create(data);

    // Verificar si es un error
    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo crear el producto',
      };
    }

    revalidatePath('/admin/products');
    if (result.data?.slug) {
      revalidatePath(`/products/${result.data.slug}`);
    }

    return {
      ok: true,
      product: result.data,
      message: result.message || 'Producto creado exitosamente',
    };
  } catch (error) {
    console.error('Error en createProductAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al crear el producto',
    };
  }
};

export async function deleteProductAction(id: string) {
  try {
    const result = await ProductService.delete(id);

    // Verificar si es un error
    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo eliminar el producto',
      };
    }

    revalidatePath('/admin/products');

    return {
      ok: true,
      message: result.message || 'Producto eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error en deleteProductAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al eliminar el producto',
    };
  }
}

export const updateProductAction = async (id: string, formData: FormData) => {
  try {
    const data = mapFormDataToProduct(formData);
    const result = await ProductService.update(id, data);

    // Verificar si es un error
    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo actualizar el producto',
      };
    }

    revalidatePath('/admin/products');
    if (result.data?.slug) {
      revalidatePath(`/products/${result.data.slug}`);
    }

    return {
      ok: true,
      product: result.data,
      message: result.message || 'Producto actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error en updateProductAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al actualizar el producto',
    };
  }
};

export const getAllProductsAction = async () => {
  try {
    const result = await ProductService.getAll();

    // Si es un error, retornar array vacío
    if (!result.success) {
      console.error('Error getting products:', result.message);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error('Error en getAllProductsAction:', error);
    return [];
  }
};

export const getProductsByCategoryAction = async (categoryName: string) => {
  try {
    const result = await ProductService.getByCategory(categoryName);

    // Si es un error, retornar array vacío
    if (!result.success) {
      console.error('Error getting products by category:', result.message);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error('Error en getProductsByCategoryAction:', error);
    return [];
  }
};

export const getProductBySlugAction = async (slug: string) => {
  try {
    const result = await ProductService.getBySlug(slug);

    // Si es un error, retornar null
    if (!result.success) {
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error('Error en getProductBySlugAction:', error);
    return null;
  }
};

export const getProductByIdAction = async (id: string) => {
  try {
    const result = await ProductService.getById(id);

    // Si es un error, retornar null
    if (!result.success) {
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error('Error en getProductByIdAction:', error);
    return null;
  }
};

export const getAllCategoriesAction = async () => {
  try {
    const result = await CategoryService.getAll();
    if (!result.success) return [];
    return result.data || [];
  } catch (error) {
    console.error('Error en getAllCategoriesAction:', error);
    return [];
  }
};