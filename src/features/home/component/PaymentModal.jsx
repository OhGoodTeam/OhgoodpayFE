import { useState } from "react";
import "../css/PaymentModal.css";
import Button from "../../../shared/components/Button";
import {
  useConfirmedModalStore,
  useConfirmedModalTextStore,
} from "../../../shared//store/ConfirmedModalStore";
import CloseButton from "../../../shared/assets/img/modalDeleteBtn.png";

const PaymentModal = () => {
  const { isOpen, closeConfirmedModal } = useConfirmedModalStore();
  const { text } = useConfirmedModalTextStore();
  const MAX_POINT = 2500; // 내 보유 포인트
  const [point, setPoint] = useState("");
  // 숫자 입력 시 최대 포인트까지만 허용
  const handleNumberClick = (num) => {
    setPoint((prev) => {
        const newValue = (prev + num).replace(/^0+/, "");
        // 숫자 변환 후 최대 포인트 제한
        if (Number(newValue) > MAX_POINT) return String(MAX_POINT);
        return newValue;
    });
    };

  const handleDelete = () => {
    setPoint((prev) => prev.slice(0, -1));
  };
  // 전액 사용 버튼
  const handleFullUse = () => {
    setPoint(String(MAX_POINT));
};

  return (
    isOpen && (
      <div className="payment-modal-overlay">
        <div className="payment-modal">
          <div className="payment-modal-title">
            <div className="title-group">
              <div className="title-request-name">주식회사 무신사에서</div>
              <div className="title-price">19,500원 을 결제합니다.</div>
            </div>
            <img
              src={CloseButton}
              alt="close"
              className="payment-modal-close-btn"
              onClick={closeConfirmedModal}
            />
          </div>

          {/* 결제 요약 */}
          <div className="payment-modal-text">
            <div className="text-group">
              <div>총 상품 금액</div>
              <div>19,500원</div>
            </div>
            <div className="text-group">
              <div>포인트 사용</div>
              <div>{point || 0}p</div>
            </div>
            <div className="text-group" style={{ fontFamily: "NanumSquare_c" }}>
              <div>총 결제 금액</div>
              <div>{19500 - (point || 0)}원</div>
            </div>
          </div>

          {/* 포인트 입력 + 전액 사용 */}
          <div className="point-box">
            <div className="point-box-header">
              <div className="point-box-title">얼마를 사용할까요?</div>
            </div>
            <div className="input-group">
                <input
                className="point-input"
                value={point}
                readOnly
                placeholder="포인트 금액"
                />
                <button className="full-use-btn" onClick={handleFullUse}>전액사용</button>
            </div>
            
            <div className="point-info">* 내 포인트 : 2,500p</div>

            <div className="number-pad">
            {/* 첫 3줄 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} onClick={() => handleNumberClick(num)}>{num}</button>
            ))}
            
            {/* 마지막 줄: 0이랑 ← 가운데 한 칸 비움 */}
            <div className="empty-cell"></div>
            <button onClick={() => handleNumberClick(0)}>0</button>
            <button onClick={handleDelete}>←</button>
            </div>

          </div>
          <div className="btn-div">
            <Button text="결제하기" status="positive" onClick={closeConfirmedModal} />
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentModal;
