// pin 입력 컴포넌트
// /api/payment/validate로 유효성 검증
// 성공 시 zustand(store)에 데이터 저장 -> PaymentModal에서 읽어 사용
// 실패 시 에러 메시지 노출 (만료/미존제 코드)

import { useEffect, useState } from "react";
import "../css/PinBox.css";
import {
  usePaymentModalStore,
  usePaymentModalTextStore,
} from "../../../shared/store/PaymentModalStore";
import { validatePinCode } from "../../pay/hooks/paymentAxios";

const PinBox = () => {
  const MAX_LENGTH = 6;
  const [pin, setPin] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  // 결제 모달 열기
  const {openPaymentModal} = usePaymentModalStore();
  // 결제 모달에서 사용할 데이터 저장
  const { setPaymentText } = usePaymentModalTextStore();

  const handleNumberClick = (num) => {
    const numStr = String(num);
    const nowPin = pin + numStr;
    // 새 입력 시작하면 에러 지우기
    if (error) setError("");
    if (nowPin.length <= MAX_LENGTH) {
      setPin(nowPin);
    } 
  };

  useEffect(() => {
    if (pin.length === MAX_LENGTH) {
      handleSubmit();
    }
  }, [pin]);

  // 핀 코드 한 글자 삭제 및 에러 초기화
  const handleDelete = () => {
    if (error) setError("");
    setPin((prev) => prev.slice(0, -1));
  };

  // 키패드 새로 열 때 에러 초기화
  const handleToggle = () => {
    if (!active && error) setError("");
    setActive((prev) => !prev);
  };

  // 백엔드 핀코드 인증 요청
  const handleSubmit = async () => {
    try {
      const data = await validatePinCode(pin, 1);
      setPaymentText({
        requestName: data.requestName,
        price: data.price,
        point: data.point,
        balance: data.balance,
        requestId:
          data.requestId ??
          data.paymentRequestId ??
          data.payment_request_id ??
          null,
      });

      // 결제 모달 오픈 
      openPaymentModal();
      setPin(""); // 입력 초기화
      setError(""); // 에러 초기화
      setActive(false); // 키패드 닫기
    } catch (err) {
      // 실패 시
      setError("유효하지않은 코드입니다.");
      setPin("");       // 입력 초기화
      setActive(true);  // 키패드 유지
    }
  };

  return (
    <div className="pin-wrapper">
      {/* 핀 박스 */}
      <div className={`pin-box ${active ? "active" : ""}`} onClick={handleToggle}>
        <span className="pin-placeholder">결제 코드를 입력해주세요.</span>
        <div className="pin-dots">
          {Array.from({ length: MAX_LENGTH }).map((_, i) => (
            <div key={i} className={`pin-dot ${i < pin.length ? "filled" : ""}`} />
          ))}
        </div>
      </div>

      {/* 키패드 */}
      {active && (
        <div className="number-pad-container">
          {error && <div className="error-text">{error}</div>}

          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num)}>
                {num}
              </button>
            ))}
            <div className="empty-cell" />
            <button onClick={() => handleNumberClick(0)}>0</button>
            <button onClick={handleDelete}>←</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinBox;
