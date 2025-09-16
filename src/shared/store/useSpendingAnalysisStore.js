import { create } from 'zustand';

// 더미 데이터
const mockData = {
  '7월': [
    { name: '전자제품', amount: 1200000, percentage: 45 },
    { name: '식비/카페', amount: 450000, percentage: 17 },
    { name: '생활용품', amount: 380000, percentage: 14 },
    { name: '기타', amount: 420000, percentage: 16 },
    { name: '쇼핑', amount: 200000, percentage: 8 }
  ],
  '8월': [
    { name: '전자제품', amount: 800000, percentage: 35 },
    { name: '식비/카페', amount: 550000, percentage: 24 },
    { name: '생활용품', amount: 420000, percentage: 18 },
    { name: '기타', amount: 380000, percentage: 17 },
    { name: '교통', amount: 150000, percentage: 6 }
  ],
  '9월': [
    { name: '쇼핑', amount: 650000, percentage: 32 },
    { name: '식비/카페', amount: 480000, percentage: 24 },
    { name: '생활용품', amount: 350000, percentage: 17 },
    { name: '기타', amount: 320000, percentage: 16 },
    { name: '문화', amount: 200000, percentage: 11 }
  ]
};

export const useSpendingAnalysisStore = create((set, get) => ({
  // 상태
  chartData: [
    { month: '7월', amount: 2650000, label: '7월 소비량' },
    { month: '8월', amount: 2300000, label: '8월 소비량' },
    { month: '9월', amount: 2000000, label: '9월 소비량' }
  ],
  selectedMonth: '7월',
  currentCategories: mockData['7월'],
  loading: false,
  error: null,
  period: '최근 3개월',

  // Actions
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  selectMonth: (month) => {
    const categories = mockData[month] || [];
    set({ 
      selectedMonth: month,
      currentCategories: categories
    });
  },

  fetchSpendingData: async () => {
    set({ loading: true, error: null });
    
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 실제 API 호출
      // const response = await fetch('/api/spending-analysis');
      // const data = await response.json();
      
      const chartData = [
        { month: '7월', amount: 2650000, label: '7월 소비량' },
        { month: '8월', amount: 2300000, label: '8월 소비량' },
        { month: '9월', amount: 2000000, label: '9월 소비량' }
      ];
      
      set({ 
        chartData,
        selectedMonth: '7월',
        currentCategories: mockData['7월'],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  updateChartData: (newData) => {
    set({ chartData: newData });
  },

  addCategory: (month, category) => {
    const currentData = { ...mockData };
    if (!currentData[month]) {
      currentData[month] = [];
    }
    currentData[month].push(category);
    
    const { selectedMonth } = get();
    if (selectedMonth === month) {
      set({ currentCategories: currentData[month] });
    }
  },

  updateCategory: (month, categoryIndex, updatedCategory) => {
    const currentData = { ...mockData };
    if (currentData[month] && currentData[month][categoryIndex]) {
      currentData[month][categoryIndex] = { 
        ...currentData[month][categoryIndex], 
        ...updatedCategory 
      };
      
      const { selectedMonth } = get();
      if (selectedMonth === month) {
        set({ currentCategories: currentData[month] });
      }
    }
  },

  // 총 소비금액 계산
  getTotalAmount: (month = null) => {
    const { selectedMonth, currentCategories, chartData } = get();
    const targetMonth = month || selectedMonth;
    
    if (targetMonth) {
      const monthData = chartData.find(item => item.month === targetMonth);
      return monthData ? monthData.amount : 0;
    }
    
    return currentCategories.reduce((total, category) => total + category.amount, 0);
  },

  // 카테고리별 비율 재계산
  recalculatePercentages: (month) => {
    const categories = mockData[month] || [];
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    
    const updatedCategories = categories.map(category => ({
      ...category,
      percentage: Math.round((category.amount / total) * 100)
    }));
    
    mockData[month] = updatedCategories;
    
    const { selectedMonth } = get();
    if (selectedMonth === month) {
      set({ currentCategories: updatedCategories });
    }
  }
}));