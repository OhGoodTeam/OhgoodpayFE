import "../../css/paymentdatails/AllPaymentsList.css";
import { usePaymentFilterStore } from "../../../../shared/store/PaymentFilterStore";
import { useEffect, useState } from "react";
import { getChoseong } from "es-hangul";
import { PiDotOutlineFill } from "react-icons/pi";
import React from "react";
import emptyimg from "../../../../shared/assets/img/emptyinfo.png";
import emptyimg2 from "../../../../shared/assets/img/questionmarkray.png";
import emptyimg3 from "../../../../shared/assets/img/headphoneray.png";
import { usePaymentDetailModalStore } from "../../../../shared/store/PaymentDetailModalStore";
import PaymentDetailModal from "../modal/PaymentDetailModal";

const AllPaymentsList = () => {
  const [groupedPayments, setGroupedPayments] = useState([]);
  const [targetPayment, setTargetPayment] = useState(null);
  const {
    isPaymentDetailModalOpen,
    openPaymentDetailModal,
    closePaymentDetailModal,
  } = usePaymentDetailModalStore();
  const {
    search,
    year,
    month,
    paymentList,
    filteredPaymentList,
    setFilteredPaymentList,
  } = usePaymentFilterStore();
  // 필터링 조건이 바뀔 때마다 paymentList, search, year, month를 감지하여 filteredPayments를 갱신합니다.
  useEffect(() => {
    const filteredPayments = paymentList.filter((payment) => {
      return (
        (payment.requestName.includes(search) ||
          getChoseong(payment.requestName).includes(search)) &&
        new Date(payment.date).getFullYear() === year &&
        new Date(payment.date).getMonth() + 1 === month
      );
    });
    setFilteredPaymentList(filteredPayments);
  }, [paymentList, search, year, month]);

  useEffect(() => {
    // payment의 날짜별로 년-월-일(YYYY-MM-DD)로 그룹화합니다.
    // groupedPayments는 [{ date: 'YYYY-MM-DD', payments: [...] }, ...] 형태의 배열이 됩니다.
    const grouped = filteredPaymentList.reduce((acc, payment) => {
      const date = new Date(payment.date);
      // 년-월-일 형식으로 날짜를 만듭니다.
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      // 해당 날짜에 해당하는 그룹이 없으면 새로 만듭니다.
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(payment);
      return acc;
    }, {});

    // 객체를 배열로 변환하여 setGroupedPayments에 저장합니다.
    setGroupedPayments(
      Object.entries(grouped).map(([date, payments]) => ({
        date,
        payments,
      }))
    );
  }, [filteredPaymentList]);

  const handlePaymentDetailModal = (paymentId) => {
    const targetPayment = paymentList.find(
      (payment) => payment.paymentId === paymentId
    );
    setTargetPayment(targetPayment);
    openPaymentDetailModal();
  };

  return (
    <>
      <div className="all-payments-list">
        {filteredPaymentList.length === 0 && (
          <div className="all-payments-list-group-payments-empty">
            <img src={emptyimg} />
            <span>결제 내역이 없습니다.</span>
          </div>
        )}
        {groupedPayments.map((group, index) => (
          <div key={index} className="all-payments-list-group">
            <div className="all-payments-list-group-date">{group.date}</div>
            <div className="all-payments-list-group-payments">
              {group.payments.map((payment, index) => (
                <div
                  key={index}
                  id={payment.paymentId}
                  className="all-payments-list-group-payments-item"
                  onClick={() => handlePaymentDetailModal(payment.paymentId)}
                >
                  <div className="all-payments-list-group-payments-item-left">
                    <div className="all-payments-list-group-payments-item-left-dot">
                      <PiDotOutlineFill />
                    </div>
                    <div className="all-payments-list-group-payments-item-left-text">
                      <div className="all-payments-list-group-payments-name">
                        {payment.requestName}
                      </div>
                      <div className="all-payments-list-group-payments-time">
                        {payment.date.substring(11, 16)}
                      </div>
                    </div>
                  </div>
                  <div className="all-payments-list-group-payments-price">
                    {payment.price.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {isPaymentDetailModalOpen ? (
          <PaymentDetailModal targetPayment={targetPayment} />
        ) : null}
      </div>
    </>
  );
};

export default React.memo(AllPaymentsList);
