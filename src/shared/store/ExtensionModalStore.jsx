import { create } from "zustand";

const useExtensionModalStore = create((set) => ({
  isExtensionModalOpen: false,
  openExtensionModal: () => set({ isExtensionModalOpen: true }),
  closeExtensionModal: () => set({ isExtensionModalOpen: false }),
}));

export { useExtensionModalStore };
