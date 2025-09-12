import "../../css/modal/PaymentDetailModal.css";
import { usePaymentDetailModalStore } from "../../../../shared/store/PaymentDetailModalStore";

const PaymentDetailModal = ({ targetPayment }) => {
  const { closePaymentDetailModal } = usePaymentDetailModalStore();
  return (
    <>
      <div className="payment-detail-modal-overlay">
        <div className="payment-detail-modal">
          <div className="payment-detail-modal-title">
            <span>{targetPayment.requestName}</span>
            <input type="button" value="X" onClick={closePaymentDetailModal} />
          </div>
          <hr></hr>
          <div className="payment-detail-modal-content">
            <div className="payment-detail-modal-content-date">
              <span>결제 일시</span>
              {/* 결제 일시를 "YYYY년 MM월 DD일 HH:MM" 형식으로 변환하여 출력합니다. */}
              <span>
                {(() => {
                  const date = new Date(targetPayment.date);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  const hours = String(date.getHours()).padStart(2, "0");
                  const minutes = String(date.getMinutes()).padStart(2, "0");
                  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
                })()}
              </span>
            </div>
            <div className="payment-detail-modal-content-total-price">
              <span>총 상품 금액</span>
              <span>{targetPayment.totalPrice.toLocaleString()}원</span>
            </div>
            <div className="payment-detail-modal-content-point">
              <span>사용 포인트</span>
              <span>{targetPayment.point.toLocaleString()}원</span>
            </div>
            <div className="payment-detail-modal-content-price">
              <span>결제 금액</span>
              <span>{targetPayment.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetailModal;
