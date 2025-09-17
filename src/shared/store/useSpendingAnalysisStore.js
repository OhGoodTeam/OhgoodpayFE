import { create } from "zustand";

// 개발용 mock 데이터 (직접 포함)
const MOCK_DATA = {
  "success": true,
  "code": 200,
  "message": "OK",
  "data": {
    "summary": {
      "date_range": { "start": "2025-07", "end": "2025-09" }
    },
    "monthly_data": {
      "2025-07": {
        "total_spend": 225000,
        "categories": {
          "식비": { "amount": 73000, "share": 0.3244, "rank": null },
          "여가/문화/교육": { "amount": 67000, "share": 0.2978, "rank": null },
          "쇼핑/패션/뷰티": { "amount": 35000, "share": 0.1556, "rank": null },
          "기타": { "amount": 30000, "share": 0.1333, "rank": null },
          "교통비": { "amount": 12000, "share": 0.0533, "rank": null },
          "생활": { "amount": 8000, "share": 0.0356, "rank": null }
        }
      },
      "2025-08": {
        "total_spend": 259000,
        "categories": {
          "기타": { "amount": 79000, "share": 0.305, "rank": null },
          "여가/문화/교육": { "amount": 68000, "share": 0.2625, "rank": null },
          "식비": { "amount": 45000, "share": 0.1737, "rank": null },
          "쇼핑/패션/뷰티": { "amount": 40000, "share": 0.1544, "rank": null },
          "교통비": { "amount": 27000, "share": 0.1042, "rank": null }
        }
      },
      "2025-09": {
        "total_spend": 815000,
        "categories": {
          "기타": { "amount": 800000, "share": 0.9816, "rank": null },
          "식비": { "amount": 15000, "share": 0.0184, "rank": null }
        }
      }
    }
  }
};

// 개발 환경에서는 mock 데이터 사용, 프로덕션에서는 실제 API 사용
const USE_MOCK = true; // 개발용으로 일단 true로 설정
const API_BASE = "http://localhost:8090";

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
  async fetchSpendingData(customerId = 1) {
    set({ loading: true, error: null });
    
    try {
      let payload;

      if (USE_MOCK) {
        // 직접 포함된 Mock 데이터 사용
        console.log('Mock 데이터 사용');
        payload = MOCK_DATA;
      } else {
        // 실제 API 호출
        const res = await fetch(
          `${API_BASE}/api/dash/spending/analyze?customerId=${customerId}`,
          { headers: { "Accept": "application/json" } }
        );
        if (!res.ok) throw new Error(`API 호출 실패: ${res.status}`);
        payload = await res.json();
      }

      // API 응답이 성공적인지 확인
      if (!payload.success) {
        throw new Error(payload.message || '데이터를 불러오는데 실패했습니다');
      }

      const body = payload.data;
      const monthlyData = body?.monthly_data || {};
      
      // 월 데이터에서 "2025-07" 형태를 정렬
      const monthKeys = Object.keys(monthlyData);
      const months = monthKeys.sort(); // "2025-07", "2025-08", "2025-09" 순으로 정렬
      
      // 가장 최근 월을 기본 선택
      const selectedMonth = months[months.length - 1] || "";

      // 카테고리 데이터 정규화
      const normalizeCats = (cats = {}) =>
        Object.entries(cats)
          .map(([name, v]) => ({
            name,
            amount: v?.amount ?? 0,
            percentage: Math.round(((v?.share ?? 0) * 100) * 10) / 10,
            rank: v?.rank ?? null,
          }))
          .sort((a, b) => b.amount - a.amount); // 금액 순으로 정렬

      // 월별 데이터 매핑
      const monthlyMap = {};
      months.forEach((monthKey) => {
        monthlyMap[monthKey] = {
          totalSpend: monthlyData[monthKey]?.total_spend ?? 0,
          categories: normalizeCats(monthlyData[monthKey]?.categories),
        };
      });

      // 기간 정보 생성
      const dateRange = body?.summary?.date_range;
      let period = "";
      if (dateRange?.start && dateRange?.end) {
        const startMonth = dateRange.start.split('-')[1];
        const endMonth = dateRange.end.split('-')[1];
        period = `${startMonth}월 ~ ${endMonth}월`;
      }

      set({
        period,
        months,
        selectedMonth,
        monthlyMap,
        currentCategories: monthlyMap[selectedMonth]?.categories ?? [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('데이터 로드 실패:', error);
      set({ 
        error: error.message, 
        loading: false 
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
      error: null
    });
  }
}));