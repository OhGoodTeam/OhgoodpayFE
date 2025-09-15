// features/recommend/component/dash/AIAdviceCard.jsx
import Card from './Card';
import './AIAdviceCard.css';

const AIAdviceCard = () => {
  return (
    <Card className="ai-advice-card">
      <div className="ai-icon">
        🤖
      </div>
      <div className="ai-content">
        <div className="ai-title">AI 맞춤 조언</div>
        <div className="ai-advice">식비 지출을 줄여보세요</div>
        <div className="ai-detail">자세히 보기 →</div>
      </div>
    </Card>
  );
};

export default AIAdviceCard;