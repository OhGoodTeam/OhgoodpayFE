import WhiteBox from "./WhiteBox";
import qrIcon from "../../../shared/assets/img/qr.png";
import "../css/QrPinAuthBox.css";
import React from "react";

const QrPinAuthBox = ({ onClick }) => {
  return (
    <WhiteBox className="qr-box" onClick={onClick}>
      <img src={qrIcon} alt="QR Icon" className="qr-title-icon" />
      <div className="qr-title">QR 스캔 / 코드 입력</div>
    </WhiteBox>
  );
};

export default QrPinAuthBox;
