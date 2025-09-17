import { create } from 'zustand';

const useDashboardStore = create((set, get) => ({
  // 상태
  loading: false,
  error: null,

  // 액션들
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setData: (data) => set({ data }),
  
  // 개별 데이터 업데이트
  updateOhgoodScore: (scoreData) => 
    set((state) => ({
      data: {
        ...state.data,
        ohgoodScore: { ...state.data.ohgoodScore, ...scoreData }
      }
    })),
  
  updatePayThisMonth: (payData) =>
    set((state) => ({
      data: {
        ...state.data,
        payThisMonth: { ...state.data.payThisMonth, ...payData }
      }
    })),
    
  updateSpendingAnalysis: (analysisData) =>
    set((state) => ({
      data: {
        ...state.data,
        spendingAnalysis: { ...state.data.spendingAnalysis, ...analysisData }
      }
    })),
    
  updateAiAdvice: (adviceData) =>
    set((state) => ({
      data: {
        ...state.data,
        aiAdvice: { ...state.data.aiAdvice, ...adviceData }
      }
    })),

  // API 통신 액션들 (나중에 구현)
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: API 호출
      // const response = await api.getDashboardData();
      // set({ data: response.data, loading: false });
      
      // 임시로 더미데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  refreshData: async () => {
    const { fetchDashboardData } = get();
    await fetchDashboardData();
  }
}));

export default useDashboardStore;