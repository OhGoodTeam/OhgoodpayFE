import "../css/WidgetBox.css";

const WidgetBox = ({ children, className }) => {
  return <div className={`widget-box ${className || ""}`}>{children}</div>;
};

export default WidgetBox;
