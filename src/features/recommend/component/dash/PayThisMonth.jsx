// features/recommend/component/dash/PayThisMonth.jsx
import Card from './Card';
import './PayThisMonth.css';

const PayThisMonth = () => {
  return (
    <Card className="pay-this-month-card">
      <div className="pay-icon">
        💳
      </div>
      <div className="pay-content">
        <div className="pay-title">이번 달 결제</div>
        <div className="pay-amount">1,250,000원</div>
        <div className="pay-detail">12월 예정</div>
      </div>
    </Card>
  );
};

export default PayThisMonth;