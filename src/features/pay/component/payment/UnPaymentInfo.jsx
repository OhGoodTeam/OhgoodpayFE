import "../../css/payment/UnPaymentInfo.css";
import bronze from "../../../../shared/assets/img/bronze.png";
import silver from "../../../../shared/assets/img/silver.png";
import gold from "../../../../shared/assets/img/gold.png";
import platinum from "../../../../shared/assets/img/platinum.png";
import diamond from "../../../../shared/assets/img/diamond.png";
import { useState } from "react";
import React from "react";

const UnPaymentInfo = ({ gradeName, limitPrice, balance }) => {
  const [nowMonth, setNowMonth] = useState(new Date().getMonth() + 1);

  return (
    <>
      <div className="un-payment-info">
        <div className="un-payment-info-title">
          <span>결제대금 납부하기</span>
        </div>
        <div className="un-payment-info-content">
          <div className="un-payment-info-content-grade">
            <span className="un-payment-info-content-grade-title">
              {nowMonth}월 이용가능 금액
            </span>
            <span className="un-payment-info-content-grade-name">
              {gradeName === "bronze" ? <img src={bronze}></img> : ""}
              {gradeName === "silver" ? <img src={silver}></img> : ""}
              {gradeName === "gold" ? <img src={gold}></img> : ""}
              {gradeName === "platinum" ? <img src={platinum}></img> : ""}
              {gradeName === "diamond" ? <img src={diamond}></img> : ""}
              {gradeName === "bronze" ? "Bronze" : ""}
              {gradeName === "silver" ? "Silver" : ""}
              {gradeName === "gold" ? "Gold" : ""}
              {gradeName === "platinum" ? "Platinum" : ""}
              {gradeName === "diamond" ? "Diamond" : ""}
            </span>
          </div>
          <div className="un-payment-info-content-limit">
            <span className="un-payment-info-content-balance">
              {balance.toLocaleString()}원
            </span>
            <span className="un-payment-info-content-limit-price">
              {limitPrice.toLocaleString()}원
            </span>
          </div>
          <div className="un-payment-info-content-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    limitPrice > 0 ? (balance / limitPrice) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(UnPaymentInfo);
