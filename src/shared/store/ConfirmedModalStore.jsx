import { create } from "zustand";

const useConfirmedModalStore = create((set) => ({
  isOpen: true,
  openConfirmedModal: () => set({ isOpen: true }),
  closeConfirmedModal: () => set({ isOpen: false }),
}));

export default useConfirmedModalStore;
