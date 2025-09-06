import "../css/PaymentCard.css";
import { useState } from "react";
const PaymentCard = ({
  payment,
  handleCheckedPayments,
  handleUncheckedPayments,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleChecked = () => {
    if (isChecked) {
      setIsChecked(false);
      handleUncheckedPayments(payment.paymentId);
    } else {
      setIsChecked(true);
      handleCheckedPayments(payment.paymentId);
    }
  };
  const nowMonth = new Date().getMonth() + 1;
  const paymentMonth = new Date(payment.date).getMonth() + 1;
  return (
    <>
      <div id={payment.paymentId} className="payment-card">
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
              onChange={handleChecked}
              disabled={nowMonth != paymentMonth ? false : true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentCard;
