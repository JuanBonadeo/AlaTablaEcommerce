'use server';

import { OfferService } from '@/core/offers/offers.service';
import { revalidatePath } from 'next/cache';

function mapFormDataToOffer(formData: FormData) {
  return {
    productId: String(formData.get("productId")),
    descuento: Number(formData.get("descuento")),
    descripcion: formData.get("descripcion") ? String(formData.get("descripcion")) : undefined,
    desde: new Date(String(formData.get("desde"))),
    hasta: new Date(String(formData.get("hasta"))),
  };
}

export const createOfferAction = async (formData: FormData) => {
  try {
    const data = mapFormDataToOffer(formData);
    const result = await OfferService.create(data);
    
    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo crear la oferta',
      };
    }

    revalidatePath('/admin/offers');
    revalidatePath('/productos');
    revalidatePath('/');

    return {
      ok: true,
      offer: result.data,
      message: result.message || 'Oferta creada exitosamente',
    };
  } catch (error) {
    console.error('Error en createOfferAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al crear la oferta',
    };
  }
};

export async function deleteOfferAction(id: string) {
  try {
    const result = await OfferService.delete(id);
    
    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo eliminar la oferta',
      };
    }

    revalidatePath('/admin/offers');
    revalidatePath('/productos');
    revalidatePath('/');

    return {
      ok: true,
      message: result.message || 'Oferta eliminada exitosamente',
    };
  } catch (error) {
    console.error('Error en deleteOfferAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al eliminar la oferta',
    };
  }
}

export const updateOfferAction = async (id: string, formData: FormData) => {
  try {
    const data = mapFormDataToOffer(formData);
    const result = await OfferService.update(id, data);

    if (!result.success) {
      return {
        ok: false,
        message: result.message || 'No se pudo actualizar la oferta',
      };
    }

    revalidatePath('/admin/offers');
    revalidatePath('/productos');
    revalidatePath('/');

    return {
      ok: true,
      offer: result.data,
      message: result.message || 'Oferta actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error en updateOfferAction:', error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al actualizar la oferta',
    };
  }
};

export const getAllOffersAction = async () => {
  try {
    const result = await OfferService.getAll();
    
    if (!result.success) {
      console.error('Error getting offers:', result.message);
      return [];
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error en getAllOffersAction:', error);
    return [];
  }
};

export const getOfferByIdAction = async (id: string) => {
  try {
    const result = await OfferService.getById(id);
    
    if (!result.success) {
      return null;
    }
    
    return result.data || null;
  } catch (error) {
    console.error('Error en getOfferByIdAction:', error);
    return null;
  }
};

export const getActiveOffersAction = async () => {
  try {
    const result = await OfferService.getActiveOffers();
    
    if (!result.success) {
      console.error('Error getting active offers:', result.message);
      return [];
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error en getActiveOffersAction:', error);
    return [];
  }
};
