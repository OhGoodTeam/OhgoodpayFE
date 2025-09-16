import React from 'react';
import './SpendingAnalysisCard.css';
import { useSpendingStore } from '../../../../shared/store/useSpendingAnalysisStore';

const SpendingAnalysisCard = () => {
  const { analysisData, loading } = useSpendingStore();

  if (loading) {
    return (
      <div className="spending-analysis-card loading">
        <div className="loading-text">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="spending-analysis-card">
      <div className="analysis-header">
        <div className="analysis-icon">
          <img 
            src="/images/analysis-icon.png" 
            alt="분석 아이콘"
            className="icon-img"
          />
        </div>
        <h3 className="analysis-title">소비 패턴 분석</h3>
        <div className="period-selector">
          <span className="period-text">{analysisData?.period || '최근 3개월'}</span>
        </div>
      </div>
      
      <div className="chart-container">
        <img 
          src="/images/spending-chart.png" 
          alt="소비 패턴 차트"
          className="chart-image"
        />
      </div>
    </div>
  );
};

export default SpendingAnalysisCard;