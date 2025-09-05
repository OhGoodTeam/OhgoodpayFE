import "../css/QuickAccessBox.css";
import QuickButton from "./QuickButton";
import arrowIcon from "../../../shared/assets/img/arrow.png";
import checkIn from "../../../shared/assets/img/checkin.png";
import payment from "../../../shared/assets/img/payment.png";
import paymentHistory from "../../../shared/assets/img/paymentHistory.png";
const QuickAccessBox = () => {
  return (
    <div className="quick-access-box">
      <div className="title">바로가기</div>
      <QuickButton
        titleIcon={checkIn}
        title="출석체크"
        content="| 출석체크하고 포인트 적립하기"
        icon={arrowIcon}
        link="/"
      />
      <QuickButton
        titleIcon={payment}
        title="납부"
        content="| 결제대금 납부하기"
        icon={arrowIcon}
        link="/"
      />
      <QuickButton
        titleIcon={paymentHistory}
        title="결제내역"
        content="| 결제내역 확인하기"
        icon={arrowIcon}
        link="/"
      />
      <QuickButton
        titleIcon={checkIn}
        title="오굿 리포트"
        content="| 나의 리포트 확인하기"
        icon={arrowIcon}
        link="/"
      />
    </div>
  );
};

export default QuickAccessBox;
