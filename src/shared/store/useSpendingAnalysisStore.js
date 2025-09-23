import { create } from "zustand";
import callToken from "../hook/callToken";

// 개발 환경에서는 mock 데이터 사용, 프로덕션에서는 실제 API 사용
const USE_MOCK =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SPENDING === "true";
const ANALYZE_URL = "http://localhost:8080/api/dash/analyze";

export const useSpendingAnalysisStore = create((set, get) => ({
  // 기본 상태
  period: "",
  months: [],
  selectedMonth: "",
  monthlyMap: {},
  currentCategories: [],
  loading: false,
  error: null,

  // 데이터 가져오기
  async fetchSpendingData(customerId = 1, monthsCount = 3) {
    // set({ loading: true, error: null });
    let run = true;
    set((s) =>
      s.loading ? ((run = false), s) : { loading: true, error: null }
    );
    if (!run) return;
    try {
      let payload;

      if (USE_MOCK) {
        // 정적 파일 경로 하나로 단순화
        const res = await fetch("src/mocks/spendingAnalysis.json", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Mock 로드 실패: ${res.status}`);
        payload = await res.json();
      } else {
        // 실제 API 호출
        const token = await callToken();
        const res = await fetch(ANALYZE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ customerId, months: monthsCount }),
        });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.message || `API 호출 실패: ${res.status}`);
        // 표준 래퍼(success/data) 언래핑
        payload = json?.success ? json.data : json;
        if (json && "success" in json && !json.success) {
          throw new Error(json?.message || "분석 실패");
        }
      }

      // 응답 포맷(스프링/파이썬) 모두 지원
      const body =
        payload && typeof payload === "object" && "data" in payload
          ? payload.data
          : payload;
      const monthlyData = body?.monthly_data || {};
      const isSpringShape = Array.isArray(body?.months) && body?.monthlyMap;

      // // 월 데이터에서 "2025-07" 형태를 정렬
      // const monthKeys = Object.keys(monthlyData);
      // const months = monthKeys.sort(); // "2025-07", "2025-08", "2025-09" 순으로 정렬

      // // 가장 최근 월을 기본 선택
      // const selectedMonth = months[months.length - 1] || "";

      // // 카테고리 데이터 정규화
      // const normalizeCats = (cats = {}) =>
      //   Object.entries(cats)
      //     .map(([name, v]) => ({
      //       name,
      //       amount: v?.amount ?? 0,
      //       percentage: Math.round(((v?.share ?? 0) * 100) * 10) / 10,
      //       rank: v?.rank ?? null,
      //     }))
      //     .sort((a, b) => b.amount - a.amount); // 금액 순으로 정렬

      // // 월별 데이터 매핑
      // const monthlyMap = {};
      // months.forEach((monthKey) => {
      //   monthlyMap[monthKey] = {
      //     totalSpend: monthlyData[monthKey]?.total_spend ?? 0,
      //     categories: normalizeCats(monthlyData[monthKey]?.categories),
      //   };
      // });
      let monthsArr = [];
      let monthlyMap = {};
      let selectedMonth = "";

      if (isSpringShape) {
        // 스프링 가공 포맷: { months:[], monthlyMap:{ [m]: { totalSpend, categories:[...] } } }
        monthsArr = [...body.months].sort();
        monthsArr.forEach((m) => {
          const src = body.monthlyMap[m] || {};
          monthlyMap[m] = {
            totalSpend: src.totalSpend ?? src.total_spend ?? 0,
            categories: Array.isArray(src.categories)
              ? src.categories.map((c) => ({
                  name: c.name ?? "",
                  amount: Number(c.amount ?? 0),
                  percentage:
                    typeof c.percentage === "number"
                      ? c.percentage
                      : Math.round((c.share ?? 0) * 100 * 10) / 10,
                  rank: c.rank ?? null,
                }))
              : [],
          };
        });
        selectedMonth = monthsArr[monthsArr.length - 1] || "";
      } else {
        // FastAPI 포맷: monthly_data:{ "YYYY-MM": { total_spend, categories:{ name:{amount,share,rank} } } }
        const monthKeys = Object.keys(monthlyData).sort();
        monthsArr = monthKeys;
        const normalizeCats = (cats = {}) =>
          Object.entries(cats)
            .map(([name, v]) => ({
              name,
              amount: Number(v?.amount ?? 0),
              percentage: Math.round((v?.share ?? 0) * 100 * 10) / 10,
              rank: v?.rank ?? null,
            }))
            .sort((a, b) => b.amount - a.amount);
        monthKeys.forEach((monthKey) => {
          monthlyMap[monthKey] = {
            totalSpend: Number(monthlyData[monthKey]?.total_spend ?? 0),
            categories: normalizeCats(monthlyData[monthKey]?.categories),
          };
        });
        selectedMonth = monthKeys[monthKeys.length - 1] || "";
      }
      // 기간 정보 생성
      const dateRange = body?.summary?.date_range || body?.summary?.dateRange;
      let period = "";
      if (dateRange?.start && dateRange?.end) {
        const startMonth = dateRange.start.split("-")[1];
        const endMonth = dateRange.end.split("-")[1];
        period = `${startMonth}월 ~ ${endMonth}월`;
      }

      set({
        period,
        months: monthsArr,
        selectedMonth,
        monthlyMap,
        currentCategories: monthlyMap[selectedMonth]?.categories ?? [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      set({
        error: error.message,
        loading: false,
      });
    }
  },

  // 월 선택
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

  // 상태 초기화
  reset() {
    set({
      period: "",
      months: [],
      selectedMonth: "",
      monthlyMap: {},
      currentCategories: [],
      loading: false,
      error: null,
    });
  },
}));
