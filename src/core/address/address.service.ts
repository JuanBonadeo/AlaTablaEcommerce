// src/core/address/address.service.ts
import { AddressDAO } from "./address.dao";
import { ErrorHandler } from "../shared/errorHandler";
import { ResponseHandler } from "../shared/responseHandler";
import {  CreateAddress, CreateAddressSchema, UpdateAddress } from "@/lib/types/address.types";

export const AddressService = {
  getMyAddresses: async (userId: string) => {
    try {
      const addresses = await AddressDAO.getByUserId(userId);
      return ResponseHandler.success(addresses);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  getAddressById: async (id: string) => {
    try {
      const address = await AddressDAO.getById(id);
      return ResponseHandler.success(address);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  createAddress: async (data: CreateAddress) => {
    try {
      const parsed = CreateAddressSchema.parse(data);
      const newAddress = await AddressDAO.create({ ...parsed });
      if (parsed.isDefault) {
        await AddressDAO.unsetDefaultForOtherAddresses(newAddress.id, parsed.userId);
      }
      return ResponseHandler.success(newAddress);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  updateAddress: async (id: string, data: UpdateAddress) => {
    try {
      const parsed = CreateAddressSchema.partial().parse(data);
      if (parsed.isDefault) {
        await AddressDAO.unsetDefaultForOtherAddresses(id, parsed.userId!);
      }
      const updated = await AddressDAO.update(id, parsed);
      return ResponseHandler.success(updated);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

  deleteAddress: async (id: string) => {
    try {
      const deleted = await AddressDAO.delete(id);
      return ResponseHandler.success(deleted);
    } catch (error) {
      return ErrorHandler.format(error);
    }
  },

};
