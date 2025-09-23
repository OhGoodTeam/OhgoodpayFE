import "./QrPin.css";
import PinBox from "../../features/qrpin/component/PinBox";
import QrScannerBox from "../../features/qrpin/component/QrScannerBox";
import QrPinTitle from "../../features/qrpin/component/QrPinTitle";
import PaymentModal from "../../features/qrpin/component/PaymentModal";
const QrPin = () => {
  return (
    <div className="qr-pin">
        <QrPinTitle />
        <div className="scanner-box">
            <QrScannerBox />
        </div>
        <PinBox />
        <PaymentModal />
    </div>
  );
};

export default QrPin;
