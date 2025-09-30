import "../css/QuickAccessBox.css";
import QuickButton from "./QuickButton";
import arrowIcon from "../../../shared/assets/img/arrow.png";
import checkIn from "../../../shared/assets/img/checkIn.png";
import payment from "../../../shared/assets/img/payment.png";
import paymentHistory from "../../../shared/assets/img/paymentHistory.png";
import pointIcon from "../../../shared/assets/img/pointIcon.png";
import { useState } from "react";
import CheckIn from "./CheckIn";

import { useNavigate } from "react-router-dom";

const QuickAccessBox = () => {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="quick-access-box">
      <div className="title">바로가기</div>

      <QuickButton
        titleIcon={checkIn}
        title="출석 체크"
        content="| 출석 체크하고 포인트 적립하기"
        icon={arrowIcon}
        onClick={() => setShowCheckIn(true)}
      />

      <QuickButton
        titleIcon={payment}
        title="납부"
        content="| 결제 대금 납부하기"
        icon={arrowIcon}
        onClick={() => navigate("/payment")}
      />

      <QuickButton
        titleIcon={paymentHistory}
        title="결제 내역"
        content="| 결제 내역 확인하기"
        icon={arrowIcon}
        onClick={() => navigate("/payment/details")}
      />

      <QuickButton
        titleIcon={checkIn}
        title="오굿 리포트"
        content="| 나의 리포트 확인하기"
        icon={arrowIcon}
        onClick={() => navigate("/dashboard")}  
      />

      <QuickButton
        titleIcon={pointIcon}
        title="포인트 내역"
        content="| 나의 포인트 내역 확인하기"
        icon={arrowIcon}
        onClick={() => navigate("/point/history")}
      />

      {showCheckIn && <CheckIn onClose={() => setShowCheckIn(false)} />}
    </div>
  );
};
export default QuickAccessBox;
