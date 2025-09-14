import ProfileAvatar from './ProfileAvatar.jsx';
import chatProfile from '../../../../shared/assets/img/chat_profile.png';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  return (
    <div className={`message ${message.sender}`}>
      {message.sender === 'bot' && (
        <ProfileAvatar size={50} src={chatProfile} alt="챗봇 프로필" />
      )}
      <div className="message-bubble">
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;