import { useState, useRef, useEffect } from 'react';
import MessageBubble from '../../../features/recommend/component/chat/MessageBubble.jsx';
import ChatInput from '../../../features/recommend/component/chat/ChatInput.jsx';
import ChatToggle from '../../../features/recommend/component/chat/ChatToggle.jsx';
import './Chat.css';

const Chat = () => {
  // TODO : 현재는 하드코딩, 추후 API 연동 예정
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 무엇을 도와드릴까요?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeToggle, setActiveToggle] = useState('상품추천');
  const messagesEndRef = useRef(null);

  // TODO : 현재는 하드코딩, 추후 분리 및 이벤트 처리 필요
  const toggleOptions = ['상품추천', '내 리포트 보기', '기타'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages([...messages, newMessage]);
      setInputValue('');

      // 봇 응답 시뮬레이션
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "네, 알겠습니다. 더 자세한 내용을 알려주시면 도와드리겠습니다.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleClick = (option) => {
    setActiveToggle(option);
  };


  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-section">
        <ChatInput
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          disabled={!inputValue.trim()}
        />

        <ChatToggle
          options={toggleOptions}
          activeToggle={activeToggle}
          onToggleClick={handleToggleClick}
        />
      </div>
    </div>
  );
};

export default Chat;