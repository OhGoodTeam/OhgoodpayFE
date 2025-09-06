import "../css/PredictforMonth.css";
import { useState, useEffect } from "react";

const PredictforMonth = ({ unpaidPayment, extension, auto }) => {
  const [sum, setSum] = useState(0);
  const [dDay, setDDay] = useState(0);
  const [month, setMonth] = useState(0);
  const [expireMonth, setExpireMonth] = useState(0);
  const [expireDay, setExpireDay] = useState(0);
  useEffect(() => {
    if (!unpaidPayment || unpaidPayment.length === 0) return;

    const firstPaymentDate = new Date(unpaidPayment[0].date);
    const month = firstPaymentDate.getMonth() + 1;
    const expireMonth = month + 1;

    setMonth(month);
    setExpireMonth(expireMonth);

    // 금액 합계 계산
    let totalSum = unpaidPayment
      .map((item) => item.price)
      .reduce((acc, curr) => acc + curr, 0);

    // 현재 달과 비교하여 조건을 작성합니다.
    let expireDay;
    if (expireMonth === new Date().getMonth() + 1 && extension) {
      // month에 저장된 달의 말일을 구해서 expireDay로 설정합니다.
      expireDay = new Date(
        firstPaymentDate.getFullYear(),
        expireMonth,
        0
      ).getDate();
    } else {
      expireDay = 15;
    }
    setExpireDay(expireDay);

    // 이자 계산 (auto가 true이고 조건을 만족할 때)
    if (
      expireDay ===
        new Date(firstPaymentDate.getFullYear(), expireMonth, 0).getDate() &&
      auto
    ) {
      const interest = totalSum * 0.02;
      const interDay = new Date().getDate() - 15;
      if (interDay > 0) {
        totalSum += interest * interDay;
      }
    }
    setSum(totalSum);

    // expireMonth와 expireDay를 기준으로 오늘부터 남은 일수를 계산하여 dDay에 저장합니다.
    const today = new Date();
    const targetDate = new Date(
      today.getFullYear(),
      expireMonth - 1,
      expireDay
    );
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDDay(diffDays);
  }, [unpaidPayment, extension, auto]);

  return (
    <>
      <div className="predictfor-month">
        <div className="predictfor-month-left">D-{dDay}</div>
        <div className="predictfor-month-right">
          <div className="predictfor-month-right-top">
            <span>{month}월 납부 예정 금액</span>
            <span> | </span>
            <span>
              {expireMonth}월 {expireDay}일 납부
            </span>
          </div>
          <div className="predictfor-month-right-bottom">
            <span>{sum.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PredictforMonth;
