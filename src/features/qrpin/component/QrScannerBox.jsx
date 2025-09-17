import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import "qr-scanner/qr-scanner-worker.min.js";
import "../css/QrScannerBox.css";
import {
  usePaymentModalStore,
  usePaymentModalTextStore,
} from "../../../shared/store/PaymentModalStore";
import axiosInstance from "../../../shared/api/axiosInstance";

const QrScannerBox = () => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState("");

  const setPaymentText = usePaymentModalTextStore((s) => s.setPaymentText);
  const openPaymentModal = usePaymentModalStore((s) => s.openPaymentModal);

  const handleQrSuccess = async (qrValue) => {
    try {
      const response = await axiosInstance.post("/api/payment/validate", {
        codeType: "qrcode",
        value: qrValue,
      });

      const data = response.data;
      console.log("결제 모달 데이터:", data);

      setPaymentText({
        requestName: data.requestName,
        price: data.price,
        point: data.point,
        balance: data.balance,
        requestId:
          data.requestId ||
          data.paymentRequestId || // ← 이거 추가
          data.payment_request_id || // ← 이거 추가
          null,
      });

      // 모달 열기
      openPaymentModal();
    } catch (e) {
      console.error("결제창 실행 오류:", e);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (result?.data && result.data !== scanResult) {
          console.log("QR 코드 스캔 성공:", result.data);
          setScanResult(result.data);
          handleQrSuccess(result.data);
        }
      },
      {
        onDecodeError: (err) => {
          if (err?.message && err.message !== "No QR code found") {
            console.error("스캔 오류:", err.message);
          }
        },
        preferredCamera: "environment",
      }
    );

    scanner.start();
    return () => scanner.stop();
  }, [scanResult]);

  return (
    <div className="qr-scanner-container">
      <video ref={videoRef} className="qr-video" />
      <div className="qr-corner-overlay">
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>
      </div>
    </div>
  );
};

export default QrScannerBox;
