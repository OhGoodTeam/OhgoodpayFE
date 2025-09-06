import "../css/PaymentInfo.css";
import bronze from "../../../shared/assets/img/bronze.png";
import silver from "../../../shared/assets/img/silver.png";
import gold from "../../../shared/assets/img/gold.png";
import platinum from "../../../shared/assets/img/platinum.png";
import diamond from "../../../shared/assets/img/diamond.png";
import { useState } from "react";

const PaymentInfo = ({ gradeName, limitPrice, balance }) => {
  const [nowMonth, setNowMonth] = useState(new Date().getMonth() + 1);

  return (
    <>
      <div className="payment-info">
        <div className="payment-info-title">
          <span>결제대금 납부하기</span>
        </div>
        <div className="payment-info-content">
          <div className="payment-info-content-grade">
            <span className="payment-info-content-grade-title">
              {nowMonth}월 이용가능 금액
            </span>
            <span className="payment-info-content-grade-name">
              <img src={bronze}></img>
              {gradeName === "bronze" ? "Bronze" : ""}
              {gradeName === "silver" ? "Silver" : ""}
              {gradeName === "gold" ? "Gold" : ""}
              {gradeName === "platinum" ? "Platinum" : ""}
              {gradeName === "diamond" ? "Diamond" : ""}
            </span>
          </div>
          <div className="payment-info-content-limit">
            <span className="payment-info-content-balance">
              {(limitPrice - balance).toLocaleString()}원
            </span>
            <span className="payment-info-content-limit-price">
              {limitPrice.toLocaleString()}원
            </span>
          </div>
          <div className="payment-info-content-progress">
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

export default PaymentInfo;
