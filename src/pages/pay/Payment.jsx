import "./Payment.css";
import PaymentInfo from "../../features/pay/component/PaymentInfo";
import PredictPayment from "../../features/pay/component/PredictPayment";
import UnpaidPayment from "../../features/pay/component/UnPaidPayments";
import { useEffect, useState } from "react";
import axiosInstance from "../../shared/api/axiosInstance";
import Button from "../../shared/components/Button";
import ExtensionModal from "../../features/pay/component/ExtensionModal";
import ConfirmedModal from "../../shared/components/ConfirmedModal";
import { useConfirmedModalStore } from "../../shared/store/ConfirmedModalStore";
import { useExtensionModalStore } from "../../shared/store/ExtensionModalStore";

const Payment = () => {
  const [customerId, setCustomerId] = useState(1);
  const [account, setAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [auto, setAuto] = useState(false);
  const [extension, setExtension] = useState(false);
  const [balance, setBalance] = useState(0);
  const [unpaidPayments, setUnpaidPayments] = useState([]);
  const [gradeName, setGradeName] = useState("");
  const [pointPercentage, setPointPercentage] = useState(0);
  const [limitPrice, setLimitPrice] = useState(0);
  const [firstMonth, setFirstMonth] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const { isExtensionModalOpen, openExtensionModal, closeExtensionModal } =
    useExtensionModalStore();
  const [checkedPayments, setCheckedPayments] = useState([]);
  const handleCheckedPayments = (paymentId) => {
    setCheckedPayments((prev) => [...prev, paymentId]);
  };
  const handleUncheckedPayments = (paymentId) => {
    setCheckedPayments((prev) => prev.filter((id) => id !== paymentId));
  };

  const { isOpen, openConfirmedModal, closeConfirmedModal } =
    useConfirmedModalStore();

  useEffect(() => {
    getApi();
  }, []);

  const getApi = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/payment/info/1");
      console.log(response.data);
      setCustomerId(response.data.customerId);
      setAccount(response.data.account);
      setAccountName(response.data.accountName);
      setAuto(response.data.auto);
      setExtension(response.data.extension);
      setBalance(response.data.balance);
      setUnpaidPayments(response.data.unpaidBills);
      setGradeName(response.data.gradeName);
      setPointPercentage(response.data.pointPercentage);
      setLimitPrice(response.data.limitPrice);
      const firstMonth = response.data.unpaidBills[0][0].date.substring(5, 7);
      setFirstMonth(firstMonth);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="payment-page">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <PaymentInfo
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
                status="negative"
                onClick={openExtensionModal}
              />
              <Button text="즉시 납부" status="positive" onClick={() => {}} />
            </div>
            {isExtensionModalOpen ? (
              <ExtensionModal
                customerId={customerId}
                extension={extension}
                firstMonth={firstMonth}
              />
            ) : null}
            {isOpen ? <ConfirmedModal /> : null}
          </>
        )}
      </div>
    </>
  );
};

export default Payment;
