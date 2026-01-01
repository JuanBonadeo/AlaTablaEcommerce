// src/core/address/address.dao.ts
import { prisma } from "@/db/client";
import { CreateAddress, UpdateAddress } from "@/lib/types/address.types.js";
import { Address } from "@prisma/client";

export const AddressDAO = {
  getAll: async (): Promise<Address[]> => {
    return prisma.address.findMany();
  },

  getById: async (id: string) => {
    return prisma.address.findUnique({
      where: { id },
    });
  },

  getByUserId: async (userId: string) => {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
  },

  create: async (data: CreateAddress): Promise<Address> => {
    return prisma.address.create({ data });
  },

  update: async (id: string, data: UpdateAddress): Promise<Address> => {
    return prisma.address.update({ where: { id }, data });
  },

  delete: async (id: string): Promise<Address> => {
    return prisma.address.delete({ where: { id } });
  },
  unsetDefaultForOtherAddresses: async (addressId: string, userId: string): Promise<void> => {
    await prisma.address.updateMany({
      where: {
        userId,
        id: { not: addressId },
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }
};
