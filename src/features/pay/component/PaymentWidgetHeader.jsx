import "../css/PaymentWidgetHeader.css";
import logo from "../../../shared/assets/img/logo_big.png";
import closeIcon from "../../../shared/assets/img/closeIcon.png";

const PaymentWidgetHeader = () => {
  return (
    <>
      <div className="payment-widget-header">
        <img src={logo} alt="logo" className="logo-icon" />
        <img src={closeIcon} alt="close" className="close-icon"/>
      </div>
    </>
  );
};

export default PaymentWidgetHeader;