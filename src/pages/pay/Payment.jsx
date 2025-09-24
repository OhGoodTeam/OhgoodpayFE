import "./Payment.css";
import UnPaymentInfo from "../../features/pay/component/payment/UnPaymentInfo";
import PredictPayment from "../../features/pay/component/payment/PredictPayment";
import UnpaidPayment from "../../features/pay/component/payment/UnPaidPayments";
import { useEffect, useState } from "react";
import axiosInstance from "../../shared/api/axiosInstance";
import Button from "../../shared/components/Button";
import ExtensionModal from "../../features/pay/component/modal/ExtensionModal";
import ConfirmedModal from "../../shared/components/ConfirmedModal";
import { useConfirmedModalStore } from "../../shared/store/ConfirmedModalStore";
import { useExtensionModalStore } from "../../shared/store/ExtensionModalStore";
import ImmediatelyPaymentModal from "../../features/pay/component/modal/ImmediatelyPaymentModal";
import { useImmediatelyPaymentModalStore } from "../../shared/store/ImmediatelyPaymentModalStore";
import React from "react";

const Payment = () => {
  const [customerId, setCustomerId] = useState(0);
  const [account, setAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [auto, setAuto] = useState(false);
  const [extension, setExtension] = useState(false);
  const [balance, setBalance] = useState(0);
  const [unpaidPayments, setUnpaidPayments] = useState([]);
  const [gradeName, setGradeName] = useState("");
  const [pointPercentage, setPointPercentage] = useState(0);
  const [limitPrice, setLimitPrice] = useState(0);
  const [firstYearMonth, setFirstYearMonth] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const { isExtensionModalOpen, openExtensionModal } = useExtensionModalStore();
  const [checkedPayments, setCheckedPayments] = useState([]);
  const handleCheckedPayments = (paymentId) => {
    setCheckedPayments((prev) => [...prev, paymentId]);
  };
  const handleUncheckedPayments = (paymentId) => {
    setCheckedPayments((prev) => prev.filter((id) => id !== paymentId));
  };

  const { isOpen } = useConfirmedModalStore();

  const { isImmediatelyPaymentModalOpen, openImmediatelyPaymentModal } =
    useImmediatelyPaymentModalStore();

  useEffect(() => {
    getApi();
  }, []);

  const getApi = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/payment/info`);
      if (response != null) {
        setIsLoading(false);
      }
      console.log(response.data);
      setCustomerId(response.data.customerId);
      setAccount(response.data.account);
      setAccountName(response.data.accountName);
      setAuto(response.data.auto);
      setExtension(response.data.extension);
      setBalance(response.data.balance);
      setGradeName(response.data.gradeName);
      setPointPercentage(response.data.pointPercentage);
      setLimitPrice(response.data.limitPrice);
      if (response.data.unpaidBills) {
        setUnpaidPayments(response.data.unpaidBills);
        const firstYearMonth =
          new Date(response.data.unpaidBills[0][0].date).getFullYear() +
          "-" +
          (new Date(response.data.unpaidBills[0][0].date).getMonth() + 1);
        setFirstYearMonth(firstYearMonth);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <>
      <div className="payment-page">
        {isLoading ? (
          <div className="payment-page-loading">
            <span>Loading...</span>
          </div>
        ) : (
          <>
            <UnPaymentInfo
              gradeName={gradeName}
              limitPrice={limitPrice}
              balance={balance}
            />
            <PredictPayment
              unpaidPayments={unpaidPayments}
              extension={extension}
              auto={auto}
            />
            <UnpaidPayment
              unpaidPayments={unpaidPayments}
              checkedPayments={checkedPayments}
              handleCheckedPayments={handleCheckedPayments}
              handleUncheckedPayments={handleUncheckedPayments}
            />
            <div className="payment-page-service">
              <Button
                text="연장 신청"
                status="positive"
                onClick={openExtensionModal}
              />
              <Button
                text="즉시 납부"
                status="default"
                onClick={openImmediatelyPaymentModal}
              />
            </div>
            {isExtensionModalOpen ? (
              <ExtensionModal
                customerId={customerId}
                extension={extension}
                firstYearMonth={firstYearMonth}
              />
            ) : null}
            {isImmediatelyPaymentModalOpen ? (
              <ImmediatelyPaymentModal
                account={account}
                accountName={accountName}
                customerId={customerId}
              />
            ) : null}
            {isOpen ? <ConfirmedModal /> : null}
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(Payment);
