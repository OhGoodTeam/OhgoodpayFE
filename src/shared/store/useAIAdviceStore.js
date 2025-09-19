// src/sheard/store/AIAdviceStore.js
import { create } from "zustand";
import dashApi from "../api/dashApi"; 

/** API 래퍼(success/code/message/data)와 직접 페이로드 모두 수용해서 표준화 */
const toAdviceState = (payloadOrWrapper) => {
  const root = payloadOrWrapper?.data?.advices
    ? payloadOrWrapper.data      // { advices, meta }  ← 래퍼의 data
    : payloadOrWrapper?.advices
    ? payloadOrWrapper           // { advices, meta }  ← 직접 페이로드
    : { advices: [], meta: null };

  const advices = Array.isArray(root.advices) ? root.advices.map((a) => ({
    id: a?.id ?? "",
    title: a?.title ?? "",
    body: a?.body ?? "",
    level: a?.level ?? "LOW",
    tags: Array.isArray(a?.tags) ? a.tags : [],
    refs: Array.isArray(a?.refs) ? a.refs : [],
  })) : [];

  return { advices, meta: root.meta ?? null };
};

const useAIAdviceStore = create((set, get) => ({
  loading: false,
  error: null,
  advices: [],
  meta: null,

  /** BE 응답(json)을 그대로 넣어도 되고, json.data만 넣어도 됨 */
  setFromResponse: (json) => {
    const { advices, meta } = toAdviceState(json);
    set({ advices, meta });
  },

  setAdvices: (advices, meta = null) => set({ advices, meta }),

  /** 실제 API 호출 */
  fetchAdvices: async (customerId = 1) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch("/api/dash/advice", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "application/json" },
//         body: JSON.stringify({ customerId }), // 필요 시 필드명 조정
//       });
//       const json = await res.json();

//       const ok = json?.success === true || json?.code === 200 || json?.code === "200";
//       if (!ok) throw new Error(json?.message || "AI 조언 API 오류");

//       const { advices, meta } = toAdviceState(json.data ?? json);
//       set({ advices, meta, loading: false });
//     } catch (e) {
//       set({ error: e?.message ?? String(e), loading: false });
//     }
//   },

//   clear: () => set({ advices: [], meta: null, error: null }),
// }));

// get() 없이 중복 호출 가드
    let shouldRun = true;
    set((s) => {
      if (s.loading) {
        shouldRun = false;
        return s;
      }
      return { loading: true, error: null };
    });
    if (!shouldRun) return;

    try {
      // dashApi는 ApiResponseWrapper를 언래핑해 data만 반환함
      const data = await dashApi.advice(customerId);
      const { advices, meta } = toAdviceState(data);
      set({ advices, meta });
    } catch (e) {
      set({ error: e?.message ?? String(e) });
    } finally {
      set({ loading: false });
    }
  },

  clear: () => set({ advices: [], meta: null, error: null }),
}));

export default useAIAdviceStore;
