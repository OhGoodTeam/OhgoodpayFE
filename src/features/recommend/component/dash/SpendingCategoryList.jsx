// src/features/recommend/component/dash/SpendingCategoryList.jsx
import React from 'react';
import { useSpendingAnalysisStore } from '../../../../shared/store/useSpendingAnalysisStore';
import './SpendingCategoryList.css';

// 카테고리별 색상 매핑
const getCategoryColor = (categoryName, index) => {
  const colorMap = {
    '고정비': '#6366f1',
    '쇼핑/패션/뷰티': '#3b82f6', 
    '생활용품': '#10b981', 
    '기타': '#6b7280', 
    '식비': '#f59e0b', 
    '교통비': '#ef4444', 
    '생활': '#8b5cf6', 
    '의료/건강': '#06b6d4', 
    '여가/문화/교육': '#0ea5e9' 
  };
  // 매핑 없는 카테고리일 경우
  return colorMap[categoryName] || ['#6366f1', '#3b82f6', '#10b981', '#6b7280', '#f59e0b', '#ef4444'][index % 6];
};

export default function SpendingCategoryList() {
  const { currentCategories, selectedMonth, monthlyMap } = useSpendingAnalysisStore();

  // 선택된 월의 총 소비금액
  const totalAmount = monthlyMap[selectedMonth]?.totalSpend || 0;

  // 월 표시 형태 변환 ("2025-07" -> "7월")
  const displayMonth = selectedMonth ? 
    `${parseInt(selectedMonth.split('-')[1])}월` : '9월';

  return (
    <div className="spending-category-list">
      <div className="category-header">
        <span className="selected-month-info">
          {displayMonth} 소비 내역
        </span>
      </div>

      <div className="category-items">
        {currentCategories.map((category, index) => (
          <div className="category-item" key={`${category.name}-${index}`}>
            <div className="category-info">
              <div 
                className="category-dot" 
                style={{ backgroundColor: getCategoryColor(category.name, index) }}
              />
              <span className="category-name">{category.name}</span>
            </div>
            <div className="category-amount-section">
              <span className="category-amount">
                {(category.amount || 0).toLocaleString()}원
              </span>
              <span className="category-percentage">
                {category.percentage || 0}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {currentCategories.length === 0 && (
        <div className="no-data">
          <p>해당 월의 소비 데이터가 없습니다.</p>
        </div>
      )}

      {/* 총 소비금액 표시 */}
      {totalAmount > 0 && (
        <div className="total-amount-section">
          <div className="total-amount-item">
            <span className="total-label">총 소비</span>
            <span className="total-amount">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
      )}
    </div>
  );
}