// usePayThisMonthStore.js
import { create } from "zustand";
import dashApi from "../api/dashApi"; // ✅ 올바른 import (객체)

const useBNPLStore = create((set, get) => ({
  loading: false,
  inFlight: false,
  error: null,
  month: "",
  amount: 0,
  pointsThisMonth: 0,
  pointBalance: 0,
  items: [],

  setFromResponse: (data) => set({ ...data }),

  setManually: ({ month, amount, pointsThisMonth, pointBalance, items }) =>
    set({
      month: month ?? "",
      amount: Number(amount ?? 0),
      pointsThisMonth: Number(pointsThisMonth ?? 0),
      pointBalance: Number(pointBalance ?? 0),
      items: Array.isArray(items) ? items : [],
    }),

  // me(토큰) 기준. 특정 고객 조회가 필요하면 dashApi에 payThisMonthById 추가 권장
  fetchThisMonth: async () => {
    let run = true;
    set((s) =>
      s.inFlight ? ((run = false), s) : { loading: true, inFlight: true, error: null }
    );
    if (!run) return;

    try {
      const data = await dashApi.payThisMonth(); // ✅ /api/dash/me/pay-this-month
      set({ ...data }); // data = { month, amount, pointsThisMonth, pointBalance, items }
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? String(e);
      set({ error: msg });
    } finally {
      set({ loading: false, inFlight: false });
    }
  },

  clear: () =>
    set({
      month: "",
      amount: 0,
      pointsThisMonth: 0,
      pointBalance: 0,
      items: [],
      error: null,
    }),
}));

export default useBNPLStore;
