import { create } from "zustand";

const usePaymentDetailModalStore = create((set) => ({
  isPaymentDetailModalOpen: false,
  openPaymentDetailModal: () => set({ isPaymentDetailModalOpen: true }),
  closePaymentDetailModal: () => set({ isPaymentDetailModalOpen: false }),
}));

export { usePaymentDetailModalStore };
