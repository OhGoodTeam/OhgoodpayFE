import {create} from "zustand";

const usePaymentModalStore = create((set) => ({
  isPaymentModalOpen: false, 
  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),
}));

const usePaymentModalTextStore = create((set) => ({
  paymentText: null, 
  setPaymentText: (paymentText) => set({ paymentText }),
}));

export { usePaymentModalStore, usePaymentModalTextStore };