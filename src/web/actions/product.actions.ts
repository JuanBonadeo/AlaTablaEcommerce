'use server';

import { ProductService } from '@/core/products/products.service';
import { Product, ProductWithoutSlug } from '@/lib/types/product.types';
import { revalidatePath } from 'next/cache';
import { getAllProducts } from '@/web/helpers/getAllProducts';



function mapFormDataToProduct(formData: FormData): ProductWithoutSlug {
  return {
    name: String(formData.get("name")),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    categoryId: String(formData.get("categoryId")),
    images: (formData.getAll("images") as string[]).map((i) => String(i)),

    description: formData.get("description")
      ? String(formData.get("description"))
      : undefined,

    variants: formData.get("variants")
      ? JSON.parse(String(formData.get("variants")))
      : undefined,
  };
}
export const createProductAction = async (formData: FormData) => {
  // Paso 1: convertir formData en objeto plano
  const data = mapFormDataToProduct(formData);

  // Paso 2: llamar al servicio
  const result = await ProductService.create(data);
  
  // Paso 3: manejar errores
  if (!result.ok) {
    return {
      ok: false,
      message: result.message ?? 'No se pudo crear el producto',
      errors: result.errors ?? null,
    };
  }

  // Paso 4: revalidar paths para refrescar cache
  revalidatePath('/admin/products');
  revalidatePath(`/products/${result.data.slug}`);

  return {
    ok: true,
    product: result.data,
  };
};


export async function deleteProductAction(id: string) {
  const result = await ProductService.delete(id);
  console.log(result);             
  // Manejar errores
  if (!result.ok) {
    return {
      ok: false,
      message: result.message ?? 'No se pudo eliminar el producto',
    };
  }

  // Revalidar paths para refrescar cache
  revalidatePath('/admin/products');

  return {
    ok: true,
  };
}



export const updateProductAction = async (id: string, formData: FormData) => {
  // Paso 1: convertir formData en objeto plano
  const data = mapFormDataToProduct(formData);

  // Paso 2: llamar al servicio
  const result = await ProductService.update(id, data);

  // Paso 3: manejar errores
  if (!result.ok) {
    return {
      ok: false,
      message: result.message ?? 'No se pudo actualizar el producto',
      errors: result.errors ?? null,
    };
  }

  // Paso 4: revalidar paths para refrescar cache
  revalidatePath('/admin/products');
  revalidatePath(`/products/${result.data.slug}`);

  return {
    ok: true,
    product: result.data,
  };
};

export const getAllProductsAction = async () => {
  return await ProductService.getAll();
};

export const getProductBySlugAction = async (slug: string) => {
  return await ProductService.getBySlug(slug);
}