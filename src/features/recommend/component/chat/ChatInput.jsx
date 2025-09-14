import { IoSend } from 'react-icons/io5';
import './ChatInput.css';

const ChatInput = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress,
  disabled = false
}) => {
  return (
    <div className="input-container">
      <div className="input-wrapper">
        <textarea
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          placeholder="메시지를 입력하세요..."
          className="message-input"
          rows="1"
        />
      </div>

      <button
        className="send-btn"
        onClick={onSendMessage}
        disabled={disabled}
      >
        <IoSend size={20} />
      </button>
    </div>
  );
};

export default ChatInput;