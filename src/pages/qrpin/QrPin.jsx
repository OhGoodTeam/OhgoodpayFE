import "./QrPin.css";
import PinBox from "../../features/qrpin/component/PinBox";
import QrScannerBox from "../../features/qrpin/component/QrScannerBox";
import QrPinTitle from "../../features/qrpin/component/QrPinTitle";
const QrPin = () => {
  return (
    <div className="qr-pin">
        <QrPinTitle />
        <div className="scanner-box">
            <QrScannerBox />
        </div>
        <PinBox />
    </div>
  );
};

export default QrPin;
