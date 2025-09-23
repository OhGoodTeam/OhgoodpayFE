import "./PaymentDetails.css";
import AllPaymentsList from "../../features/pay/component/paymentdetails/AllPaymentsList";
import SearchPayment from "../../features/pay/component/paymentdetails/SearchPayment";
import { useState } from "react";
import axiosInstance from "../../shared/api/axiosInstance";
import { useEffect } from "react";
import { usePaymentFilterStore } from "../../shared/store/PaymentFilterStore";
import React from "react";

const PaymentDetails = () => {
  const { setPaymentList } = usePaymentFilterStore();
  const getApi = async () => {
    const response = await axiosInstance.get(`/api/payment/history`);
    if (response.status === 200) {
      setPaymentList(response.data);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      <div className="payment-details-page">
        <div className="payment-details-title">
          <span>결제 내역</span>
        </div>
        <SearchPayment />
        <AllPaymentsList />
      </div>
    </>
  );
};

export default React.memo(PaymentDetails);
