// src/features/recommend/component/dash/SpendingAnalysisCard.jsx
import React, { useEffect } from 'react';
import Card from './Card';
import SpendingCategoryList from './SpendingCategoryList';
import './SpendingAnalysisCard.css';
import { useSpendingAnalysisStore } from '../../../../shared/store/useSpendingAnalysisStore';

const SpendingAnalysisCard = ({ customerId = 1, monthsToAnalyze = 3 }) => {
  const { 
    period, 
    months, 
    monthlyMap, 
    selectedMonth, 
    loading, 
    error,
    fetchSpendingData, 
    selectMonth 
  } = useSpendingAnalysisStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchSpendingData(customerId, monthsToAnalyze);
  }, [customerId, monthsToAnalyze, fetchSpendingData]);

  // 디버깅을 위한 콘솔 로그
  console.log('Store 상태:', { period, months, monthlyMap, selectedMonth, loading, error });

  // 차트 데이터 준비
  const chartData = months.map(monthKey => {
    // "2025-07" -> "07월"로 변환
    const monthPart = monthKey.split('-')[1];
    return {
      month: `${monthPart}월`,
      monthKey: monthKey,
      amount: monthlyMap[monthKey]?.totalSpend || 0,
      isSelected: monthKey === selectedMonth
    };
  });

  console.log('차트 데이터:', chartData);

  // 최대값 계산 (차트 높이 비율용)
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  // 바 클릭 핸들러
  const handleBarClick = (monthKey) => {
    selectMonth(monthKey);
  };

  // 금액 포맷팅
  const formatAmount = (value) => {
    if (value >= 10000) {
      return `${Math.floor(value / 10000)}만원`;
    }
    return `${Math.floor(value / 1000)}천원`;
  };

  if (loading) {
    return (
      <Card className="spending-analysis-card loading">
        <div className="loading-text">데이터를 불러오는 중...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="spending-analysis-card">
        <div className="error-text">데이터 로드 실패: {error}</div>
        <button onClick={() => fetchSpendingData(customerId, monthsToAnalyze)}>다시 시도</button>
      </Card>
    );
  }

  if (!months.length) {
    return (
      <Card className="spending-analysis-card">
        <div className="no-data-text">소비 데이터가 없습니다.</div>
      </Card>
    );
  }

  return (
    <Card className="spending-analysis-card">
      <div className="analysis-header">
        <div className="analysis-icon">📊</div>
        <h3 className="analysis-title">소비 패턴 분석</h3>
        <div className="period-info">
          <span className="period-text">{period || '최근 3개월'}</span>
        </div>
      </div>

      <div className="analysis-content">
        {/* 월별 소비 추이 차트 */}
        <div className="chart-section">
          <h4 className="chart-title">월별 소비 추이</h4>
          <div className="simple-chart-container">
            {chartData.map((data, index) => {
              const height = (data.amount / maxAmount) * 100;
              return (
                <div 
                  key={index}
                  className="chart-bar-wrapper"
                  onClick={() => handleBarClick(data.monthKey)}
                >
                  <div className="chart-bar-container">
                    <div 
                      className={`chart-bar ${data.isSelected ? 'selected' : ''}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="chart-label">
                    <div className="chart-month">{data.month}</div>
                    <div className="chart-amount">{formatAmount(data.amount)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 카테고리별 소비 */}
        <div className="category-section">
          <h4 className="category-title">카테고리별 소비</h4>
          <SpendingCategoryList />
        </div>
      </div>
    </Card>
  );
};

export default SpendingAnalysisCard;