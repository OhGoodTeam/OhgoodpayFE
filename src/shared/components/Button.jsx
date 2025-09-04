import "../assets/css/Button.css";
const Button = ({ text, status, onClick }) => {
  const btnType = status === "positive" ? "btn-positive" : "btn-negative";
  return (
    <input
      id="btn-component"
      type="button"
      value={text}
      className={`button ${btnType}`}
      onClick={onClick}
    />
  );
};

export default Button;
