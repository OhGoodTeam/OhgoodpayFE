import { create } from "zustand";

const useUnpaidPaymentsStore = create((set, get) => ({
  // 선택된 결제 내역들 (payment 객체 전체를 저장)
  selectedPayments: [],

  // 결제 내역 선택
  selectPayment: (payment) => {
    set((state) => ({
      selectedPayments: [...state.selectedPayments, payment],
    }));
  },

  // 결제 내역 선택 해제
  unselectPayment: (paymentId) => {
    set((state) => ({
      selectedPayments: state.selectedPayments.filter(
        (payment) => payment.paymentId !== paymentId
      ),
    }));
  },

  // 여러 결제 내역 선택
  selectMultiplePayments: (payments) => {
    set((state) => {
      // 중복 제거를 위해 기존 선택된 것들과 병합
      const existingIds = new Set(
        state.selectedPayments.map((p) => p.paymentId)
      );
      const newPayments = payments.filter(
        (payment) => !existingIds.has(payment.paymentId)
      );
      return {
        selectedPayments: [...state.selectedPayments, ...newPayments],
      };
    });
  },

  // 모든 결제 내역 선택 해제
  clearAllSelections: () => {
    set({ selectedPayments: [] });
  },

  // 특정 결제 내역이 선택되었는지 확인
  isPaymentSelected: (paymentId) => {
    return get().selectedPayments.some(
      (payment) => payment.paymentId === paymentId
    );
  },

  // 선택된 결제 내역 개수
  getSelectedCount: () => {
    return get().selectedPayments.length;
  },

  // 선택된 결제 내역의 총 금액
  getTotalAmount: () => {
    return get().selectedPayments.reduce(
      (total, payment) => total + payment.price,
      0
    );
  },
}));

export default useUnpaidPaymentsStore;
