import "./QrPin.css";
import PinBox from "../../features/qrpin/component/PinBox";
import QrPinTitle from "../../features/qrpin/component/QrPinTitle";
const QrPin = () => {
  return (
    <div className="qr-pin">
        <QrPinTitle />
        <PinBox />
    </div>
  );
};

export default QrPin;
