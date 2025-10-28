import { create } from 'zustand';

interface AddressState {
  addressId: string | null;
  setAddressId: (id: string | null) => void;
  clearAddress: () => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  addressId: null,

  setAddressId: (id) => set({ addressId: id }),

  clearAddress: () => set({ addressId: null }),
}));
