import { useNavigate } from "react-router-dom";
import "../css/QrPinTitle.css";
import CloseButton from "../../../shared/assets/img/closeWhiteBtn.png";

const QrPinTitle = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <>
      <div className="qr-pin-title">
        <div className="title-text">결제</div>
        <img
          src={CloseButton}
          alt="close"
          className="qr-pin-close-btn"
          onClick={handleClose}
        />
      </div>
      <div className="qr-pin-content">
        <div className="content-text">QR코드를 촬영하거나 코드입력을 선택해주세요</div>
      </div>
    </>
  );
};

export default QrPinTitle;
