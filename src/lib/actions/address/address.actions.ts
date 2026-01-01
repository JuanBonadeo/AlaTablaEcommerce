'use server';

import { AddressService } from "@/core/address/address.service";
import type { Address, CreateAddress } from "@/lib/types/address.types";
import { revalidatePath } from "next/cache.js";

export const createAddressAction = async (data: CreateAddress) => {
  try {
    const result = await AddressService.createAddress({ ...data });

    if (!result.success) {
      return { ok: false, message: result.message };
    }
    return { ok: true, address: result.data, message: "Dirección creada exitosamente" };
  } catch (error) {
    console.error("Error en createAddressAction:", error);
    return { ok: false, message: "Error inesperado al crear la dirección", details: error instanceof Error ? error.message : String(error) };
  }
  finally {
    // Cleanup or final actions if needed
    revalidatePath('/checkout/address'); // Revalidate the checkout page
  }
};

export const getMyAddressesAction = async (userId: string): Promise<Address[]> => {
  try {
    const result = await AddressService.getMyAddresses(userId);
    if (!result.success) {
      return [];
    }
    return (result.data ?? []) 
  } catch (error) {
    console.error("Error en getMyAddressesAction:", error);
    return [];
  } finally {
    // Cleanup or final actions if needed
    revalidatePath('/checkout/address'); // Revalidate the checkout page
  }
};

export const deleteAddressAction = async (id: string) => {
  try {
    const result = await AddressService.deleteAddress(id);
    if (!result.success) {
      return { ok: false, message: result.message };
    }
    return { ok: true, message: "Dirección eliminada exitosamente" };
  } catch (error) {
    console.error("Error en deleteAddressAction:", error);
    return { ok: false, message: "Error inesperado al eliminar la dirección", details: error instanceof Error ? error.message : String(error) };
  }
  finally {
    // Cleanup or final actions if needed
    revalidatePath('/checkout/address'); // Revalidate the checkout page
  }
};

export const updateAddressAction = async (id: string, data: Partial<CreateAddress>) => {
  try {
    const result = await AddressService.updateAddress(id, data);
    if (!result.success) {
      return { ok: false, message: result.message };
    }
    return { ok: true, address: result.data, message: "Dirección actualizada exitosamente" };
  } catch (error) {
    console.error("Error en updateAddressAction:", error);
    return { ok: false, message: "Error inesperado al actualizar la dirección", details: error instanceof Error ? error.message : String(error) };
  } finally {
    // Cleanup or final actions if needed
    revalidatePath('/checkout/address'); // Revalidate the checkout page
  }
};

export const getAddressByIdAction = async (id: string): Promise<Address | null> => {
  try {
    const result = await AddressService.getAddressById(id);
    if (!result.success || !result.data) {
      return null;
    }
    return result.data;
  } catch (error) {
    console.error("Error en getAddressByIdAction:", error);
    return null;
  }
};
