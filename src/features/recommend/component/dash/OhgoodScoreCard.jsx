// features/recommend/component/dash/OhgoodScoreCard.jsx
import Card from './Card';
import './OhgoodScoreCard.css';

const OhgoodScoreCard = () => {
  return (
    <Card className="ohgood-score-card">
      <div className="score-icon">
        📊
      </div>
      <div className="score-content">
        <div className="score-header">
          <span className="score-title">오굿점수</span>
          <span className="score-grade">1등급</span>
        </div>
        <div className="score-value">783</div>
        <div className="score-change">신용점수가 올라갔어요</div>
      </div>
    </Card>
  );
};

export default OhgoodScoreCard;