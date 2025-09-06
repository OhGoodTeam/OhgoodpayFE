import "../css/ImmediatelyPaymentModal.css";
import Button from "../../../shared/components/Button";
import useUnpaidPaymentsStore from "../../../shared/store/UnpaidPaymentsStore";
import { useState } from "react";
import kookmin from "../../../shared/assets/img/kookmin.png";
import ibk from "../../../shared/assets/img/ibk.png";
import kakao from "../../../shared/assets/img/kakao.png";
import hana from "../../../shared/assets/img/hana.png";
import woori from "../../../shared/assets/img/woori.png";
import shinhan from "../../../shared/assets/img/shinhan.png";
import toss from "../../../shared/assets/img/toss.png";
import payment from "../../../shared/assets/img/payment.png";
import axiosInstance from "../../../shared/api/axiosInstance";
import {
  useConfirmedModalStore,
  useConfirmedModalTextStore,
} from "../../../shared/store/ConfirmedModalStore";
import { useImmediatelyPaymentModalStore } from "../../../shared/store/ImmediatelyPaymentModalStore";

const ImmediatelyPaymentModal = ({ account, accountName, customerId }) => {
  const { selectedPayments } = useUnpaidPaymentsStore();
  const { openConfirmedModal, closeConfirmedModal } = useConfirmedModalStore();
  const { text, setText } = useConfirmedModalTextStore();
  const { openImmediatelyPaymentModal, closeImmediatelyPaymentModal } =
    useImmediatelyPaymentModalStore();

  const getApi = async () => {
    const paymentIds = selectedPayments.map((payment) => payment.paymentId);
    const response = await axiosInstance.post(
      "/api/payment/immediately/" + customerId,
      paymentIds
    );
  };

  const handleImmediatelyPayment = () => {
    if (selectedPayments.length === 0) {
      setText("선택된 결제 내역이 없습니다.");
      openConfirmedModal();
      closeImmediatelyPaymentModal();
      return;
    } else {
      getApi();
      setText("즉시 납부 신청되었습니다.");
      openConfirmedModal();
      closeImmediatelyPaymentModal();
    }
  };

  return (
    <>
      <div className="immediately-payment-modal-overlay">
        <div className="immediately-payment-modal">
          <div className="immediately-payment-modal-title">
            <span>즉시 납부</span>
          </div>
          <div className="immediately-payment-modal-account">
            <div className="immediately-payment-modal-account-img">
              {accountName === "국민" ? <img src={kookmin} /> : null}
              {accountName === "기업" ? <img src={ibk} /> : null}
              {accountName === "카카오" ? <img src={kakao} /> : null}
              {accountName === "하나" ? <img src={hana} /> : null}
              {accountName === "우리" ? <img src={woori} /> : null}
              {accountName === "신한" ? <img src={shinhan} /> : null}
              {accountName === "토스" ? <img src={toss} /> : null}
            </div>
            <div className="immediately-payment-modal-account-info">
              <span className="immediately-payment-modal-account-number">
                출금 계좌 {account}
              </span>
              <span className="immediately-payment-modal-account-name">
                {accountName}
              </span>
            </div>
          </div>
          <hr></hr>
          <div className="immediately-payment-modal-price">
            <div className="immediately-payment-modal-price-img">
              <img src={payment} />
            </div>
            <div className="immediately-payment-modal-price-info">
              <span>결제대금</span>
              <span>
                {selectedPayments
                  .reduce((acc, payment) => acc + payment.price, 0)
                  .toLocaleString()}
                원
              </span>
            </div>
          </div>
          <div className="immediately-payment-modal-info">
            <span>* 납부한 금액은 되돌려받을 수 없습니다.</span>
          </div>
          <div className="immediately-payment-modal-button">
            <Button
              text="즉시 납부"
              status="positive"
              onClick={handleImmediatelyPayment}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImmediatelyPaymentModal;
