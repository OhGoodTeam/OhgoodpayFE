// import { create } from "zustand";

// /** BE 래퍼/직접 payload 모두 수용해서 표준화 */
// const normalize = (json) => {
//   const d = json?.data ?? json ?? {};
//   const rows = Array.isArray(d.items) ? d.items : [];

//   const items = rows.map((t, i) => ({
//     id: t.paymentId ?? i,
//     date: t.date ?? "",
//     title: t.requestName ?? t.merchant ?? "거래",
//     amount: Number(t.totalPrice ?? t.amount ?? 0),
//   }));

//   return {
//     customerId: d.customerId ?? null,
//     month: d.month ?? "",
//     from: d.from ?? null,
//     to: d.to ?? null,
//     count: Number(d.count ?? items.length),
//     sum: Number(d.sumTotalPrice ?? d.totalAmount ?? 0),
//     items,
//   };
// };

// const useThisMonthStore = create((set) => ({
//   loading: false,
//   error: null,

//   // 상태
//   customerId: null,
//   month: "",
//   from: null,
//   to: null,
//   count: 0,
//   sum: 0,
//   items: [],

//   // 액션
//   setFromResponse: (json) => set({ ...normalize(json) }),
//   setManually: (payload) => set({ ...normalize(payload) }),

//   // 엔드포인트는 프로젝트에 맞게 조정
//   fetchThisMonth: async (customerId) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch("/api/dash/pay-this-month", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "application/json" },
//         body: JSON.stringify({ customerId }),
//       });
//       const json = await res.json();
//       set({ ...normalize(json), loading: false });
//     } catch (e) {
//       set({ error: e?.message ?? String(e), loading: false });
//     }
//   },

//   clear: () =>
//     set({ customerId: null, month: "", from: null, to: null, count: 0, sum: 0, items: [], error: null }),
// }));

// export default useThisMonthStore;
