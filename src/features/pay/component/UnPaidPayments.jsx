import "../css/UnPaidPayments.css";
import PaymentCard from "./PaymentCard";
import { useState, useEffect } from "react";

const UnPaidPayments = ({
  unpaidPayments,
  handleCheckedPayments,
  handleUncheckedPayments,
}) => {
  const [totalUnpaidPayment, setTotalUnpaidPayment] = useState([]);
  useEffect(() => {
    unpaidPayments.map((unpaidPayment) =>
      unpaidPayment.map((payment) =>
        setTotalUnpaidPayment((prev) => [...prev, payment])
      )
    );
  }, []);

  return (
    <>
      <div className="unpaid-payments">
        <div className="unpaid-payments-title">
          <span>미납부 내역</span>
        </div>
        <div className="unpaid-payments-content">
          {totalUnpaidPayment.map((payment, index) => (
            <PaymentCard
              key={payment.paymentId}
              payment={payment}
              handleCheckedPayments={handleCheckedPayments}
              handleUncheckedPayments={handleUncheckedPayments}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default UnPaidPayments;
