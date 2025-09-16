import { create } from 'zustand';

// 더미 데이터
const DUMMY_DATA = {
  ohgoodScore: {
    score: 750,
    level: '우량',
    description: '저금 기획력과 오즈 포인트로 750점!'
  },
  payThisMonth: {
    bnplAmount: 170000,
    installments: [
      { merchant: '이번 달 BNPL 아울', amount: 25000, dueDate: '6월 23일' },
      { merchant: '무신사', amount: 19500, dueDate: '무신사' }
    ]
  },
  spendingAnalysis: {
    monthlyData: [
      { month: '7월', amount: 680000 },
      { month: '8월', amount: 920000 },
      { month: '9월', amount: 850000 }
    ],
    categoryData: [
      { category: '전자제품', amount: 1200000, percentage: 49, color: '#8B5CF6' },
      { category: '패션/뷰티', amount: 450000, percentage: 18, color: '#3B82F6' },
      { category: '생활용품', amount: 380000, percentage: 15, color: '#10B981' },
      { category: '기타', amount: 420000, percentage: 18, color: '#6B7280' }
    ]
  },
  aiAdvice: {
    title: 'AI 맞춤 조언',
    advice: '전자제품 소비가 49%로 높습니다. 다음 달은 생활용품 위주로 균형있게 소비할 예정이에요.',
    actionText: '분석'
  }
};

const useDashboardStore = create((set, get) => ({
  // 상태
  loading: false,
  error: null,
  data: DUMMY_DATA,

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
      set({ data: DUMMY_DATA, loading: false });
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