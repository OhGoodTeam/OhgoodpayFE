import { create } from "zustand";

const useImmediatelyPaymentModalStore = create((set) => ({
  isImmediatelyPaymentModalOpen: false,
  openImmediatelyPaymentModal: () =>
    set({ isImmediatelyPaymentModalOpen: true }),
  closeImmediatelyPaymentModal: () =>
    set({ isImmediatelyPaymentModalOpen: false }),
}));

export { useImmediatelyPaymentModalStore };
