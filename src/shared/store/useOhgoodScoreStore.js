import { create } from "zustand";

const normalize = (json) => {
  const d = json?.data ?? json ?? {};
  return {
    score: Number(d.ohgoodScore ?? 0),
    message: typeof d.message === "string" ? d.message : "",
    // 필요하면 d.sessionId, ttlSeconds 등도 보관 가능
  };
};

const useOhgoodScoreStore = create((set) => ({
  loading: false,
  error: null,
  score: 0,
  message: "",

  setFromResponse: (json) => {
    const n = normalize(json);
    set({ score: n.score, message: n.message });
  },

  setScoreManually: (score, message = "") => set({ score, message }),

  fetchScore: async (customerId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/dash/score", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const json = await res.json();
      const n = normalize(json);
      set({ score: n.score, message: n.message, loading: false });
    } catch (e) {
      set({ error: e?.message ?? String(e), loading: false });
    }
  },

  clear: () => set({ score: 0, message: "", error: null }),
}));

export default useOhgoodScoreStore;
