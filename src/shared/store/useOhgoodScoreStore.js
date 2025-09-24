// src/shared/store/useOhgoodScoreStore.js
import { create } from "zustand";
import dashApi from "../api/dashApi";

const normalize = (json) => {
  const d = json?.data ?? json ?? {};
  return {
    score: Number(d.ohgoodScore ?? 0),
    message: typeof d.message === "string" ? d.message : "",
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

  fetchScore: async (customerId = 1) => {
    // ✅ get() 없이 중복호출 가드
    let shouldRun = true;
    set((s) => {
      if (s.loading) {
        shouldRun = false;
        return s; // 상태 변경 없음
      }
      return { loading: true, error: null };
    });
    if (!shouldRun) return;

    try {
      const data = await dashApi.sayMyName(customerId); // POST /api/dash/saymyname
      const n = normalize(data);
      set({ score: n.score, message: n.message });
    } catch (e) {
      set({ error: e?.message ?? String(e) });
    } finally {
      set({ loading: false });
    }
  },

  clear: () => set({ score: 0, message: "", error: null }),
}));

export default useOhgoodScoreStore;
