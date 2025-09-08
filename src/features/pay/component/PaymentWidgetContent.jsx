import "../css/PaymentWidgetContent.css";
const PaymentWidgetContent = () => {
  return (
    <>
      <div className="widget-content-box">
        <div className="content-box">
          <div>* QR, PinCode 유효시간은 3분입니다.</div>
          <div>* 결제를 마치면 창이 자동으로 닫힙니다.</div>
          <div>* 창이 닫히지 않으면 [결제완료]를 눌러주세요.</div>
        </div>
        <div className="time-box">
          2:35
        </div>
        
      </div>
    </>
  );
};

export default PaymentWidgetContent;
