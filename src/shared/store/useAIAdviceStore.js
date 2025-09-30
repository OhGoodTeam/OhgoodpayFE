// useAIAdviceStore.js
import { create } from "zustand";
import dashApi from "../api/dashApi"; // ✅ axiosInstance 대신 dashApi 사용

const useAIAdviceStore = create((set) => ({
  loading: false,
  inFlight: false,
  error: null,
  advices: [],
  meta: null,

  // me(토큰) 기준 호출. (특정 고객 조회가 필요하면 dashApi에 adviceById 추가 권장)
  fetchAdvices: async () => {
    let run = true;
    set((s) =>
      s.inFlight ? ((run = false), s) : { loading: true, inFlight: true, error: null }
    );
    if (!run) return;

    try {
      const { advices, meta } = await dashApi.advice(); // POST /api/dash/advice
      set({ advices, meta });
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? String(e);
      set({ error: msg });
    } finally {
      set({ loading: false, inFlight: false });
    }
  },

  clear: () => set({ advices: [], meta: null, error: null }),
}));

export default useAIAdviceStore;
