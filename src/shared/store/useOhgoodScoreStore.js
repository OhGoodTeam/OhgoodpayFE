// useOhgoodScoreStore.js
import { create } from "zustand";
import dashApi from "../api/dashApi"; // ✅ dashApi만 사용

const useOhgoodScoreStore = create((set) => ({
  loading: false,
  inFlight: false,
  error: null,
  score: 0,
  message: "",

  setScoreManually: (score, message = "") => set({ score, message }),

  // me(토큰) 기준 호출. 특정 고객 조회가 필요하면 dashApi에 sayMyNameById 추가 권장
  fetchScore: async () => {
    let run = true;
    set((s) =>
      s.inFlight ? ((run = false), s) : { loading: true, inFlight: true, error: null }
    );
    if (!run) return;

    try {
      // dashApi.sayMyName() => { score, message } 이미 정규화된 형태
      const { score, message } = await dashApi.sayMyName();
      set({ score: Number(score ?? 0), message: message ?? "" });
    } catch (e) {
      set({ error: e?.response?.data?.message ?? e?.message ?? String(e) });
    } finally {
      set({ loading: false, inFlight: false });
    }
  },

  clear: () => set({ score: 0, message: "", error: null }),
}));

export default useOhgoodScoreStore;
