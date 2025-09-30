import { useRef, useEffect, memo } from 'react';
import MessageBubble from '../../../features/recommend/component/chat/MessageBubble.jsx';
import ChatInput from '../../../features/recommend/component/chat/ChatInput.jsx';
import ChatToggle from '../../../features/recommend/component/chat/ChatToggle.jsx';
import { useChatStore } from '../../../shared/store/chatStore.js';
import './Chat.css';

// ChatToggle을 위한 별도 래퍼 컴포넌트
const ChatToggleWrapper = memo(() => {
  const toggleOptions = useChatStore((state) => state.toggleOptions);
  const activeToggle = useChatStore((state) => state.activeToggle);
  const handleToggleClick = useChatStore((state) => state.handleToggleClick);
  const isLoading = useChatStore((state) => state.isLoading);
  const isTyping = useChatStore((state) => state.isTyping);

  return (
    <ChatToggle
      options={toggleOptions}
      activeToggle={activeToggle}
      onToggleClick={handleToggleClick}
      disabled={isLoading || isTyping}
    />
  );
});

ChatToggleWrapper.displayName = 'ChatToggleWrapper';

const Chat = memo(() => {
  // 메시지 관련 상태만 구독
  const messages = useChatStore((state) => state.messages);
  const handleTypingComplete = useChatStore((state) => state.handleTypingComplete);
  const initializeChat = useChatStore((state) => state.initializeChat);

  // 입력 관련 상태만 구독
  const inputValue = useChatStore((state) => state.inputValue);
  const setInputValue = useChatStore((state) => state.setInputValue);
  const handleSendMessage = useChatStore((state) => state.handleSendMessage);
  const isLoading = useChatStore((state) => state.isLoading);
  const isTyping = useChatStore((state) => state.isTyping);
  const currentFlow = useChatStore((state) => state.currentFlow);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 컴포넌트 마운트시 항상 채팅 초기화
  useEffect(() => {
    // 뒤로가기든 새로고침이든 항상 resetChat으로 깨끗하게 시작
    const resetChat = useChatStore.getState().resetChat;
    resetChat();
  }, []);


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
          disabled={isLoading || isTyping || currentFlow === 'flow_mismatch'}
          sendDisabled={!inputValue.trim() || isLoading || isTyping || currentFlow === 'flow_mismatch'}
        />

        <ChatToggleWrapper />
      </div>
    </div>
  );
});

Chat.displayName = 'Chat';

export default Chat;