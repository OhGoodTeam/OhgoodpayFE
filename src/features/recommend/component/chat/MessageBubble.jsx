import ProfileAvatar from "./ProfileAvatar.jsx";
import chatProfile from "../../../../shared/assets/img/chat_profile.png";
import { useTypingEffect } from "../../hooks/useTypingEffect.js";
import QuickButton from "../../../home/component/QuickButton";
import checkIn from "../../../../shared/assets/img/checkIn.png";
import payment from "../../../../shared/assets/img/payment.png";
import paymentHistory from "../../../../shared/assets/img/paymentHistory.png";
import pointIcon from "../../../../shared/assets/img/pointIcon.png";
import arrowIcon from "../../../../shared/assets/img/arrow.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckIn from "../../../home/component/CheckIn";
import { useChatStore } from "../../../../shared/store/chatStore.js";
import "./MessageBubble.css";

const ICON_MAP = {
  checkin: checkIn,
  payment: payment,
  paymentHistory: paymentHistory,
  point: pointIcon,
  dashboard: checkIn, // 대시보드용 아이콘이 없어서 임시로 checkIn 사용
};

const MessageBubble = ({
  message,
  isAnimating = true,
  enableTyping = false,
  onTypingComplete,
  hideProfile = false,
}) => {
  const navigate = useNavigate();
  const { handleToggleClick } = useChatStore();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const shouldUseTyping =
    enableTyping && message.sender === "bot" && message.type === "text";

  const { displayedText, isTyping } = useTypingEffect(
    message.text,
    20, // 타이핑 속도 (ms) - 더 빠르게
    shouldUseTyping,
    onTypingComplete
  );

  const renderMessageContent = () => {
    switch (message.type) {
      case "loading":
        return (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        );

      case "product":
        return (
          <div className="product-message">
            {message.image && (
              <img
                src={message.image}
                alt={message.title}
                className="product-image"
              />
            )}
            <div className="product-content">
              {message.category && (
                <div className="product-category">{message.category}</div>
              )}
              <h4>{message.title}</h4>
              {message.price && (
                <span className="product-price">{message.price}</span>
              )}
              {message.link && (
                <button
                  className="product-btn"
                  onClick={() => window.open(message.link, "_blank")}
                >
                  상품 보기
                </button>
              )}
            </div>
          </div>
        );

      case "quickmenu":
        return (
          <QuickButton
            titleIcon={ICON_MAP[message.menuInfo.icon]}
            title={message.menuInfo.title}
            content={`| 바로 가기`}
            icon={arrowIcon}
            onClick={() => {
              if (message.menuInfo.action === "checkin") {
                setShowCheckIn(true);
              } else if (message.menuInfo.route) {
                navigate(message.menuInfo.route);
              }
            }}
            className="message-quick-button"
          />
        );

      case "text":
      default: {
        return <p>{shouldUseTyping ? displayedText : message.text}</p>;
      }
    }
  };

  return (
    <div
      className={`message ${message.sender} ${
        isAnimating ? "message-appear" : ""
      }`}
    >
      {message.sender === "bot" && !hideProfile && (
        <ProfileAvatar size={50} src={chatProfile} alt="챗봇 프로필" />
      )}
      <div className="message-content">
        <div className={`message-bubble ${message.type || "text"}`}>
          {renderMessageContent()}
        </div>
      </div>
      {showCheckIn && <CheckIn onClose={() => setShowCheckIn(false)} />}
    </div>
  );
};

export default MessageBubble;
