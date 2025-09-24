import "../assets/css/Button.css";
const Button = ({ text, status, onClick }) => {
  let btnType = "";
  if (status === "default") {
    btnType = "btn-default";
  } else if (status === "positive") {
    btnType = "btn-positive";
  } else if (status === "negative") {
    btnType = "btn-negative";
  }
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
