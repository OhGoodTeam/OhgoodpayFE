import { create } from "zustand";

const useConfirmedModalStore = create((set) => ({ 
  isOpen: false,
  isRefresh: false,
  openConfirmedModal: () => set({ isOpen: true }),
  openConfirmedModalWithRefresh: () => set({ isOpen: true, isRefresh: true }),
  closeConfirmedModal: () => set({ isOpen: false }),
}));

const useConfirmedModalTextStore = create((set) => ({
  text: null, 
  setText: (text) => set({ text }),
}));

export { useConfirmedModalStore, useConfirmedModalTextStore };
