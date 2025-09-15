// features/recommend/component/dash/SpendingAnalysisCard.jsx
import Card from './Card';
import './SpendingAnalysisCard.css';

const SpendingAnalysisCard = () => {
  return (
    <Card className="spending-analysis-card">
      <div className="spending-icon">
        📈
      </div>
      <div className="spending-content">
        <div className="spending-title">소비 분석</div>
        <div className="spending-summary">이번 달 850,000원</div>
        <div className="spending-trend">평소보다 15% ↑</div>
      </div>
    </Card>
  );
};

export default SpendingAnalysisCard;