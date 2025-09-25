// store/usePayThisMonthStore
import { create } from "zustand";
import callToken from "../hook/callToken";

const normalize = (json) => {
  const d = json?.data ?? json ?? {};

  // 합계 금액
  const amountRaw =
    d.sumTotalPrice ??
    d.amount ??
    d.bnplAmount ??
    d.bnpl_this_month_amount ??
    0;

  // 항목
  const rows =
    d.items ?? d.transactions ?? d.recentTransactions ?? d.installments ?? [];
  const items = Array.isArray(rows)
    ? rows.map((t, i) => ({
        id: t.id ?? t.paymentId ?? i,
        date: t.date ?? t.dueDate ?? "",
        merchant: t.merchant ?? t.store ?? t.requestName ?? "가맹점",
        amount: Number(t.amount ?? t.totalPrice ?? 0),
        point: Number(t.point ?? 0),
      }))
    : [];

  // 이번달 적립 포인트 (필드 없으면 items 합으로 계산)
  const pointsThisMonthRaw =
    d.sumPointThisMonth ??
    d.points ??
    d.earnedPoints ??
    d.pointEarnedThisMonth ??
    items.reduce((acc, t) => acc + (Number(t.point) || 0), 0);

  // 현재 보유 포인트
  const pointBalanceRaw = d.currentPointBalance ?? d.pointBalance ?? 0;

  return {
    month: d.month ?? "",
    amount: Number(amountRaw),
    pointsThisMonth: Number(pointsThisMonthRaw),
    pointBalance: Number(pointBalanceRaw),
    items,
  };
};

const useBNPLStore = create((set) => ({
  loading: false,
  error: null,
  month: "",
  amount: 0,
  pointsThisMonth: 0,
  pointBalance: 0,
  items: [],

  setFromResponse: (json) => set({ ...normalize(json) }),

  setManually: ({ month, amount, pointsThisMonth, pointBalance, items }) =>
    set({
      month: month ?? "",
      amount: Number(amount ?? 0),
      pointsThisMonth: Number(pointsThisMonth ?? 0),
      pointBalance: Number(pointBalance ?? 0),
      items: Array.isArray(items) ? items : [],
    }),

  fetchThisMonth: async (customerId = 1) => {
    const token = await callToken();
    set({ loading: true, error: null });
    try {
      // const res = await fetch("/api/dash/pay-this-month", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Accept: "application/json" },
      //   body: JSON.stringify({ customerId }),
      // });
      const res = await fetch(
        `http://localhost:8080/api/dash/customer/${encodeURIComponent(
          customerId
        )}/pay-this-month`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      set({ ...normalize(json), loading: false });
    } catch (e) {
      set({ error: e?.message ?? String(e), loading: false });
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
