// useSpendingAnalysisStore.js
import { create } from "zustand";
import dashApi from "../api/dashApi"; // ✅ dashApi로 교체

// 개발 환경에서는 mock 데이터 사용 (선택)
const USE_MOCK =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SPENDING === "true";

export const useSpendingAnalysisStore = create((set, get) => ({
  period: "",
  months: [],
  selectedMonth: "",
  monthlyMap: {},
  currentCategories: [],
  loading: false,
  inFlight: false,
  error: null,

  // 토큰(me) 기준. monthsCount만 받으면 됨
  async fetchSpendingData(monthsCount = 3) {
    let run = true;
    set((s) =>
      s.inFlight ? ((run = false), s) : { loading: true, inFlight: true, error: null }
    );
    if (!run) return;

    try {
      let data;
      if (USE_MOCK) {
        const res = await fetch("/src/mocks/spendingAnalysis.json", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Mock 로드 실패: ${res.status}`);
        // mock은 dashApi의 반환 형태와 맞춰주기
        const mock = await res.json();
        const months = Array.isArray(mock?.months)
          ? [...mock.months].sort()
          : Object.keys(mock?.monthly_data ?? {}).sort();
        const selectedMonth = months[months.length - 1] || "";
        data = {
          period: mock?.summary?.date_range
            ? `${Number(mock.summary.date_range.start.split("-")[1])}월 ~ ${Number(
                mock.summary.date_range.end.split("-")[1]
              )}월`
            : "",
          months,
          monthlyMap: mock?.monthlyMap ?? {}, // 필요 시 mock 포맷 맞춰 매핑
          selectedMonth,
        };
      } else {
        // ✅ dashApi가 언래핑/정규화까지 수행
        data = await dashApi.analyze(monthsCount);
        // data = { period, months, monthlyMap, selectedMonth }
      }

      const { period, months, monthlyMap, selectedMonth } = data;
      set({
        period: period ?? "",
        months: months ?? [],
        selectedMonth: selectedMonth ?? "",
        monthlyMap: monthlyMap ?? {},
        currentCategories: (monthlyMap?.[selectedMonth]?.categories) ?? [],
        loading: false,
        inFlight: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message ?? error?.message ?? String(error),
        loading: false,
        inFlight: false,
      });
    }
  },

  selectMonth(monthKey) {
    const { monthlyMap } = get();
    const monthData = monthlyMap[monthKey];
    if (monthData) {
      set({
        selectedMonth: monthKey,
        currentCategories: monthData.categories ?? [],
      });
    }
  },

  reset() {
    set({
      period: "",
      months: [],
      selectedMonth: "",
      monthlyMap: {},
      currentCategories: [],
      loading: false,
      inFlight: false,
      error: null,
    });
  },
}));
