import "../css/PaymentCard.css";
import { useState, useEffect } from "react";

const PaymentCard = ({
  payment,
  isSelected,
  onSelect,
  currentMonth,
  hasPreviousMonth,
}) => {
  const [isChecked, setIsChecked] = useState(isSelected);

  // isSelected prop이 변경될 때 isChecked 상태 동기화
  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  // 결제 월 계산
  const paymentMonth = new Date(payment.date).getMonth() + 1;

  // 이번 달 내역이지만 전월 내역이 있을 때는 선택 불가
  const isDisabled = hasPreviousMonth && paymentMonth === currentMonth;

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onSelect(payment, checked);
  };

  return (
    <>
      <div className="payment-card">
        <div className="payment-card-left">
          <div className="payment-card-day">
            <span>{payment.date.substring(5, 10)}</span>
          </div>
          <div className="payment-card-name">
            <span>{payment.requestName}</span>
          </div>
        </div>
        <div className="payment-card-right">
          <div className="payment-card-price">
            <span>{payment.price.toLocaleString()}원</span>
          </div>
          <div className="payment-card-status">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCard;
