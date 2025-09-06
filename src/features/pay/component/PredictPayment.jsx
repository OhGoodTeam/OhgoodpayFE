import "../css/PredictPayment.css";
import PredictforMonth from "./PredictforMonth";

const PredictPayment = ({ unpaidPayments, extension, auto }) => {
  return (
    <>
      <div className="predict-payment">
        <div className="predict-payment-title">
          <span>납부 예정</span>
        </div>
        <div className="predict-payment-content">
          {unpaidPayments.map((unpaidPayment, index) => (
            <PredictforMonth
              key={index}
              unpaidPayment={unpaidPayment}
              extension={extension}
              auto={auto}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PredictPayment;
