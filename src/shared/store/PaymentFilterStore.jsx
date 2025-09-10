import { create } from "zustand";

const usePaymentFilterStore = create((set) => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  search: "",
  paymentList: [],
  filteredPaymentList: [],
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
  setPaymentList: (paymentList) => set({ paymentList }),
  setFilteredPaymentList: (filteredPaymentList) => set({ filteredPaymentList }),
  setSearch: (search) => set({ search }),
}));

export { usePaymentFilterStore };
