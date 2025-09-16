import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import SpendingCategoryList from './SpendingCategoryList';
import { useSpendingAnalysisStore } from '../store/spendingAnalysisStore';
import './SpendingAnalysisCard.css';

const SpendingAnalysisCard = () => {
  const { 
    chartData, 
    selectedMonth, 
    loading, 
    selectMonth 
  } = useSpendingAnalysisStore();

  if (loading) {
    return (
      <div className="spending-analysis-card loading">
        <div className="loading-text">로딩 중...</div>
      </div>
    );
  }

  const handleBarClick = (data) => {
    if (data && data.month) {
      selectMonth(data.month);
    }
  };

  const CustomBar = (props) => {
    const { payload, ...rest } = props;
    const isSelected = payload?.month === selectedMonth;
    
    return (
      <Bar
        {...rest}
        fill={isSelected ? '#6366f1' : payload?.month === selectedMonth ? '#6366f1' : '#a5b4fc'}
        className={`spending-bar ${isSelected ? 'selected' : ''}`}
      />
    );
  };

  return (
    <div className="spending-analysis-card">
      <div className="analysis-header">
        <div className="analysis-icon">📊</div>
        <h3 className="analysis-title">소비 패턴 분석</h3>
        <div className="period-info">
          <span className="period-text">최근 3개월</span>
        </div>
      </div>

      <div className="analysis-content">
        <div className="chart-section">
          <h4 className="chart-title">월별 소비 추이</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                barCategoryGap="20%"
              >
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#6b7280',
                    fontFamily: 'NanumSquare_Neo-Regular'
                  }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  onClick={handleBarClick}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => (
                    <Bar
                      key={`bar-${index}`}
                      fill={entry.month === selectedMonth ? '#6366f1' : '#a5b4fc'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="category-section">
          <h4 className="category-title">카테고리별 소비</h4>
          <SpendingCategoryList />
        </div>
      </div>
    </div>
  );
};

export default SpendingAnalysisCard;