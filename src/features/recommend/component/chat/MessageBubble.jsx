import ProfileAvatar from './ProfileAvatar.jsx';
import chatProfile from '../../../../shared/assets/img/chat_profile.png';
import { useTypingEffect } from '../../hooks/useTypingEffect.js';
import './MessageBubble.css';

const MessageBubble = ({ message, isAnimating = true, enableTyping = false, onTypingComplete, hideProfile = false }) => {
  const shouldUseTyping = enableTyping && message.sender === 'bot' && message.type === 'text';

  const { displayedText, isTyping } = useTypingEffect(
    message.text,
    20, // 타이핑 속도 (ms) - 더 빠르게
    shouldUseTyping,
    onTypingComplete
  );

  const renderMessageContent = () => {
    switch (message.type) {
      case 'loading':
        return (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        );

      case 'product':
        return (
          <div className="product-message">
            {message.image && (
              <img src={message.image} alt={message.title} className="product-image" />
            )}
            <div className="product-content">
              {message.category && (
                <div className="product-category">
                  {message.category}
                </div>
              )}
              <h4>{message.title}</h4>
              {message.price && <span className="product-price">{message.price}</span>}
              {message.link && (
                <button
                  className="product-btn"
                  onClick={() => window.open(message.link, '_blank')}
                >
                  상품 보기
                </button>
              )}
            </div>
          </div>
        );

      case 'text':
      default: {
        return (
          <p>
            {shouldUseTyping ? displayedText : message.text}
          </p>
        );
      }
    }
  };

  return (
    <div className={`message ${message.sender} ${isAnimating ? 'message-appear' : ''}`}>
      {message.sender === 'bot' && !hideProfile && (
        <ProfileAvatar size={50} src={chatProfile} alt="챗봇 프로필" />
      )}
      <div className={`message-bubble ${message.type || 'text'}`}>
        {renderMessageContent()}
      </div>
    </div>
  );
};

export default MessageBubble;