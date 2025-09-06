import { create } from "zustand";

const useConfirmedModalStore = create((set) => ({
  isOpen: false,
  openConfirmedModal: () => set({ isOpen: true }),
  closeConfirmedModal: () => set({ isOpen: false }),
}));

const useConfirmedModalTextStore = create((set) => ({
  text: "",
  setText: (text) => set({ text }),
}));

export { useConfirmedModalStore, useConfirmedModalTextStore };
