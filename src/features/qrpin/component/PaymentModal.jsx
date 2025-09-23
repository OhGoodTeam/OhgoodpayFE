// 결제 모달 컴포넌트
// PinBoxd에서 validate 성공 시 zustand(store)에 저장된 text를 읽어 표시
// 포인트 입력 -> 최종 결제 API 호출(finalPayment)
// 한도 부족 상태에서 버튼 비활성화 및 클릭 차단
// 결제 성공 시 모달 닫기 -> 결제내역 페이지로 이동

import { useState } from "react";
import "../css/PaymentModal.css";
import Button from "../../../shared/components/Button";
import {
  usePaymentModalStore,
  usePaymentModalTextStore,
} from "../../../shared/store/PaymentModalStore";
import CloseButton from "../../../shared/assets/img/modalDeleteBtn.png";
import { finalPayment } from "../../pay/hooks/paymentAxios";
import { useNavigate } from "react-router-dom";

const PaymentModal = () => {
  // Zustand selector 패턴 사용
  const isPaymentModalOpen = usePaymentModalStore((s) => s.isPaymentModalOpen);
  const closePaymentModal = usePaymentModalStore((s) => s.closePaymentModal);
  const paymentText = usePaymentModalTextStore((s) => s.paymentText);

  const MAX_POINT = paymentText?.point || 0;
  const [point, setPoint] = useState("");

  // 최종 결재 금액 & 한도 부족 여부
  // 상품금액 - 사용포인트
  const finalPrice = (paymentText?.price || 0) - (Number(point) || 0);
  // balance < finalPrice 일 때 true
  const insufficient =
    typeof paymentText?.balance === "number" &&
    paymentText.balance < finalPrice;

  //결제 진행 상테/오류 메시지
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState("");

  // 최종 결제 버튼 핸들러
  const handlePayment = async () => {
    if (insufficient || loading) return; // 한도 부족 또는 로딩 중이면 클릭 차단
    if (!paymentText?.requestId) {
      setPayError("결제 요청 정보가 없습니다.");
      return;
    }
    try {
      setLoading(true);
      setPayError("");

      const resp = await finalPayment({
        customerId: 1,
        point: Number(point) || 0,
        requestId: paymentText.requestId,
      });

      if (resp.success && resp.result) {
        // 성공 처리
        closePaymentModal();
        setPoint("");
        navigate("/payment/details");
      } else {
        setPayError("결제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      setPayError(e.message || "결제 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 포인트 입력 핸들러
  const handleNumberClick = (num) => {
    setPoint((prev) => {
      const next = (prev + num).replace(/^0+/, "");
      // 결제 금액과 내 포인트 중 작은 값까지만 허용
      const maxUsable = Math.min(paymentText?.price || 0, MAX_POINT);
      return Number(next) > maxUsable ? String(maxUsable) : next;
    });
  };
  const handleDelete = () => setPoint((p) => p.slice(0, -1));
  const handleFullUse = () => {
    const maxUsable = Math.min(paymentText?.price || 0, MAX_POINT);
    setPoint(String(maxUsable));
  };

  const navigate = useNavigate();

  return (
    isPaymentModalOpen && (
      <div className="payment-modal-overlay">
        <div className="payment-modal">
          {!paymentText ? (
            // 로딩 상태
            <div className="payment-modal-title">
              <div className="title-group">
                <div className="title-request-name">로딩 중...</div>
              </div>
              <img
                src={CloseButton}
                alt="close"
                className="payment-modal-close-btn"
                onClick={closePaymentModal}
              />
            </div>
          ) : (
            <>
              {/* 타이틀 */}
              <div className="payment-modal-title">
                <div className="title-group">
                  <div className="title-request-name">
                    {paymentText.requestName}에서
                  </div>
                  <div className="title-price">
                    {paymentText.price}원 을 결제합니다.
                  </div>
                </div>
                <img
                  src={CloseButton}
                  alt="close"
                  className="payment-modal-close-btn"
                  onClick={closePaymentModal}
                />
              </div>

              {/* 결제 금액 및 포인트 사용 */}
              <div className="payment-modal-text">
                <div className="text-group">
                  <div>총 상품 금액</div>
                  <div>{paymentText.price}원</div>
                </div>
                <div className="text-group">
                  <div>포인트 사용</div>
                  <div>{point || 0}p</div>
                </div>
                <div
                  className="text-group"
                  style={{ fontFamily: "NanumSquare_c" }}
                >
                  <div>총 결제 금액</div>
                  <div>{finalPrice}원</div>
                </div>
              </div>

              {/* 포인트 입력 */}
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
                  <button className="full-use-btn" onClick={handleFullUse}>
                    전액사용
                  </button>
                </div>

                <div className="point-info">* 내 포인트 : {MAX_POINT}p</div>

                <div className="payment-number-pad">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button key={n} onClick={() => handleNumberClick(n)}>
                      {n}
                    </button>
                  ))}
                  <div className="payment-empty-cell"></div>
                  <button onClick={() => handleNumberClick(0)}>0</button>
                  <button onClick={handleDelete}>←</button>
                </div>
              </div>

              {/* 한도 부족 알림 + 결제 버튼 */}
              <div className="btn-div">
                <Button
                  text={
                    loading
                      ? "결제 중..."
                      : insufficient
                      ? "한도가 부족합니다."
                      : "결제하기"
                  }
                  status={insufficient || loading ? "disabled" : "positive"}
                  onClick={() => {
                    if (insufficient || loading) return;
                    handlePayment();
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default PaymentModal;
