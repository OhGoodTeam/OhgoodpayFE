import { create } from "zustand";

// 개발 환경에서는 mock 데이터 사용, 프로덕션에서는 실제 API 사용
const USE_MOCK = true; // 개발용으로 일단 true로 설정
const API_BASE = "http://localhost:8090";
const MOCK_URL = "src/mocks/spendingAnalysis.json";

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
        // Mock 데이터 로드 - 여러 경로 시도
        console.log('Mock 데이터 로드 시도...');
        
        const possiblePaths = [
          "src/mocks/spendingAnalysis.json"
        ];

        let loadSuccess = false;
        
        for (const path of possiblePaths) {
          try {
            console.log(`시도 중인 경로: ${path}`);
            const res = await fetch(path, { 
              headers: { 
                "Accept": "application/json",
                "Content-Type": "application/json"
              } 
            });
            
            if (res.ok) {
              payload = await res.json();
              console.log(`성공! 경로: ${path}`);
              loadSuccess = true;
              break;
            } else {
              console.log(`실패 (${res.status}): ${path}`);
            }
          } catch (pathError) {
            console.log(`경로 에러: ${path}`, pathError.message);
          }
        }

        if (!loadSuccess) {
          throw new Error('모든 Mock 경로에서 파일을 찾을 수 없습니다');
        }

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