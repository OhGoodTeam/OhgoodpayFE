import "../css/CheckIn.css";
import CloseButton from "../../../shared/assets/img/modalDeleteBtn.png";
import Roulette from "./Roulette";
import rouletteRay from "../../../shared/assets/img/rouletteRay.png"; //
const CheckIn = ({ onClose }) => {
  return (
    <div className="checkin-overlay" onClick={onClose}>
      <div className="checkin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkin-title">
            <div className="checkin-title-group">
                <div className="checkin-title-text">매일 출석체크하고</div>
                <div className="checkin-subtitle-text">포인트 받아요🩵</div>
            </div>
            <img src={CloseButton} alt="close" className="payment-modal-close-btn" onClick={onClose}/>
        </div>
        <div className="checkin-content">
            <Roulette />
        </div>
        
      </div>
    </div>
  );
};

export default CheckIn;
