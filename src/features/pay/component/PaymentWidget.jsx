import "../css/PaymentWidget.css";
import "../css/WidgetBox.css";
import PaymentWidgetHeader from "./PaymentWidgetHeader";
import PaymentWidgetCodeBox from "./PaymentWidgetCodeBox";
import PaymentWidgetContent from "./PaymentWidgetContent";
import PaymentConfirmedButton from "./PaymentConfirmedButton";


const PaymentWidget = () => {
  return (
    <div className="payment-widget">
      <PaymentWidgetHeader />
      <PaymentWidgetCodeBox />
      <PaymentWidgetContent />
      <PaymentConfirmedButton />
    </div>
  );
};

export default PaymentWidget;
