import React from "react";
import "../css/WhiteBox.css";

const WhiteBox = ({ children, className }) => {
  return <div className={`white-box ${className || ""}`}>{children}</div>;
};

export default WhiteBox;
