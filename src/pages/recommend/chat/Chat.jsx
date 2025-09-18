import { useRef, useEffect } from 'react';
import MessageBubble from '../../../features/recommend/component/chat/MessageBubble.jsx';
import ChatInput from '../../../features/recommend/component/chat/ChatInput.jsx';
import ChatToggle from '../../../features/recommend/component/chat/ChatToggle.jsx';
import { useChatStore } from '../../../shared/store/chatStore.js';
import './Chat.css';

const Chat = () => {
  const {
    messages,
    inputValue,
    activeToggle,
    toggleOptions,
    isLoading,
    isTyping,
    setInputValue,
    handleSendMessage,
    handleToggleClick,
    handleTypingComplete,
    initializeChat
  } = useChatStore();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 컴포넌트 마운트시 초기 채팅 시작
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            enableTyping={message.isTyping}
            onTypingComplete={() => handleTypingComplete(message.id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-section">
        <ChatInput
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          disabled={isLoading || isTyping}
          sendDisabled={!inputValue.trim() || isLoading || isTyping}
        />

        <ChatToggle
          options={toggleOptions}
          activeToggle={activeToggle}
          onToggleClick={handleToggleClick}
          disabled={isLoading || isTyping}
        />
      </div>
    </div>
  );
};

export default Chat;