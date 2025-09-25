import { useEffect } from 'react';
import useDashboardStore from '../../../shared/store/DashboardStore';

// 전체 대시보드 데이터를 관리하는 훅
export const useDashboard = () => {
  const {
    loading,
    error,
    data,
    fetchDashboardData,
    refreshData
  } = useDashboardStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    data,
    refreshData
  };
};

// 개별 컴포넌트용 훅들
export const useOhgoodScore = () => {
  const { data, updateOhgoodScore, loading } = useDashboardStore();
  
  return {
    scoreData: data?.ohgoodScore,
    updateScore: updateOhgoodScore,
    loading
  };
};

export const usePayThisMonth = () => {
  const { data, updatePayThisMonth, loading } = useDashboardStore();
  
  return {
    payData: data?.payThisMonth,
    updatePay: updatePayThisMonth,
    loading
  };
};

export const useSpendingAnalysis = () => {
  const { data, updateSpendingAnalysis, loading } = useDashboardStore();
  
  return {
    analysisData: data?.spendingAnalysis,
    updateAnalysis: updateSpendingAnalysis,
    loading
  };
};

export const useAiAdvice = () => {
  const { data, updateAiAdvice, loading } = useDashboardStore();
  
  return {
    adviceData: data?.aiAdvice,
    updateAdvice: updateAiAdvice,
    loading
  };
};