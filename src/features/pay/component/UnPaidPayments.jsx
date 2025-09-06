import "../css/UnPaidPayments.css";
import PaymentCard from "./PaymentCard";
import { useState, useEffect } from "react";
import useUnpaidPaymentsStore from "../../../shared/store/UnpaidPaymentsStore";

const UnPaidPayments = ({
  unpaidPayments,
  handleCheckedPayments,
  handleUncheckedPayments,
}) => {
  const [allPayments, setAllPayments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [hasPreviousMonth, setHasPreviousMonth] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    selectedPayments,
    selectPayment,
    unselectPayment,
    selectMultiplePayments,
    clearAllSelections,
    isPaymentSelected,
    getSelectedCount,
  } = useUnpaidPaymentsStore();

  // 미결제 내역을 1차원 배열로 변환하고 이전 달 존재 여부 확인
  useEffect(() => {
    if (unpaidPayments && unpaidPayments.length > 0) {
      const flatPayments = [];
      let hasPrevMonth = false;

      unpaidPayments.forEach((monthPayments) => {
        monthPayments.forEach((payment) => {
          const paymentMonth = new Date(payment.date).getMonth() + 1;
          if (paymentMonth < currentMonth) {
            hasPrevMonth = true;
          }
          flatPayments.push(payment);
        });
      });

      setAllPayments(flatPayments);
      setHasPreviousMonth(hasPrevMonth);
    }
  }, [unpaidPayments, currentMonth]);

  // 개별 결제 내역 선택/해제
  const handlePaymentSelect = (payment, isSelected) => {
    if (isSelected) {
      selectPayment(payment);
      handleCheckedPayments(payment.paymentId);
    } else {
      unselectPayment(payment.paymentId);
      handleUncheckedPayments(payment.paymentId);
    }
  };

  // 전체 선택 상태 업데이트
  useEffect(() => {
    const selectablePayments = allPayments.filter((payment) => {
      const paymentMonth = new Date(payment.date).getMonth() + 1;
      return !hasPreviousMonth || paymentMonth !== currentMonth;
    });

    const selectableIds = selectablePayments.map(
      (payment) => payment.paymentId
    );
    const allSelectableSelected =
      selectableIds.length > 0 &&
      selectableIds.every((id) => isPaymentSelected(id));

    setIsAllChecked(allSelectableSelected);
  }, [
    selectedPayments,
    allPayments,
    hasPreviousMonth,
    currentMonth,
    isPaymentSelected,
  ]);

  // 전체 선택/해제
  const handleAllSelect = (e) => {
    const isAllChecked = e.target.checked;

    if (isAllChecked) {
      // 선택 가능한 모든 결제 내역 선택
      const selectablePayments = allPayments.filter((payment) => {
        const paymentMonth = new Date(payment.date).getMonth() + 1;
        return !hasPreviousMonth || paymentMonth !== currentMonth;
      });

      selectMultiplePayments(selectablePayments);

      // 선택된 결제 내역들을 부모 컴포넌트에 전달
      selectablePayments.forEach((payment) =>
        handleCheckedPayments(payment.paymentId)
      );
    } else {
      // 모든 선택 해제
      clearAllSelections();

      // 선택 해제된 결제 내역들을 부모 컴포넌트에 전달
      selectedPayments.forEach((payment) =>
        handleUncheckedPayments(payment.paymentId)
      );
    }
  };

  return (
    <>
      <div className="unpaid-payments">
        <div className="unpaid-payments-title">
          <span>미납부 내역</span>
          <div className="unpaid-payments-title-checkbox">
            <span>총</span>
            <span className="unpaid-payments-title-total-checkbox">
              {getSelectedCount()} 건
            </span>
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={handleAllSelect}
            />
          </div>
        </div>
        <div className="unpaid-payments-content">
          {allPayments.map((payment, index) => (
            <PaymentCard
              key={payment.paymentId}
              payment={payment}
              isSelected={isPaymentSelected(payment.paymentId)}
              onSelect={handlePaymentSelect}
              currentMonth={currentMonth}
              hasPreviousMonth={hasPreviousMonth}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default UnPaidPayments;
