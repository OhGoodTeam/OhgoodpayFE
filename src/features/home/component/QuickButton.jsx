import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/QuickButton.css";

const QuickButton = ({ title, content, icon, titleIcon, className, onClick, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      navigate(link); 
    }
  };

  return (
    <div className={`quick-button ${className || ""}`} onClick={handleClick}>
      <div className="quick-button-text">
        {titleIcon && <img src={titleIcon} alt="title icon" className="quick-button-title-icon" />}
        <div className="quick-button-title">{title}</div>
        <div className="quick-button-content">{content}</div>
      </div>
      {icon && <img src={icon} alt="icon" className="quick-button-icon" />}
    </div>
  );
};

export default QuickButton;
