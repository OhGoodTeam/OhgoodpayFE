import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import "qr-scanner/qr-scanner-worker.min.js";
import "../css/QrScannerBox.css"; 

const QrScannerBox = () => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        // 스캔 성공시에만 로그 출력
        if (result?.data && result.data !== scanResult) {
          console.log("QR 코드 스캔 성공:", result.data);
          setScanResult(result.data);
        }
      },
      {
        onDecodeError: (err) => {
          // "No QR code found" 메시지 무시
          if (err?.message && err.message !== "No QR code found") {
            console.error("스캔 오류:", err.message);
          }
        },
        preferredCamera: "environment",
      }
    );

    scanner.start();

    return () => {
      scanner.stop();
    };
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
