import { create } from 'zustand';

// ZUSTAND를 사용하여 채팅 전역 상태관리
// TODO : 현재는 API 연결 전이라 더미 데이터로 구현
export const useChatStore = create((set, get) => ({
  messages: [
    {
      id: 1,
      type: 'text',
      text: "안녕하세요! 무엇을 도와드릴까요?",
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    }
  ],
  inputValue: '',
  activeToggle: '상품추천',
  currentTypingId: null,
  toggleOptions: ['상품추천', '내 리포트 보기', '기타'],

  // SSE 관련 상태
  sseUrl: null,
  eventSource: null,
  connectionStatus: 'disconnected',

  setInputValue: (value) => set({ inputValue: value }),

  setActiveToggle: (toggle) => set({ activeToggle: toggle }),

  setCurrentTypingId: (id) => set({ currentTypingId: id }),

  // 새 메시지 추가
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  // 로딩 메시지 제거
  removeLoadingMessages: () => set((state) => ({
    messages: state.messages.filter(msg => msg.type !== 'loading')
  })),

  // 기존 메시지 수정
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),

  // 메시지 전송 처리
  handleSendMessage: () => {
    const { inputValue, messages, addMessage, removeLoadingMessages, activeToggle, setCurrentTypingId } = get();

    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'text',
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(newMessage);
    set({ inputValue: '' });

    const loadingMessage = {
      id: messages.length + 2,
      type: 'loading',
      sender: 'bot',
      timestamp: new Date()
    };
    addMessage(loadingMessage);

    setTimeout(() => {
      removeLoadingMessages();

      if (activeToggle === '상품추천') {
        const productResponse = {
          id: messages.length + 3,
          type: 'product',
          title: '오굿페이 추천 상품',
          description: '고객님께 맞는 상품을 추천해드려요!',
          price: '₩29,900',
          image: 'https://via.placeholder.com/300x200',
          link: 'https://example.com',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: false
        };
        addMessage(productResponse);
      } else {
        const botResponseId = messages.length + 3;
        const botResponse = {
          id: botResponseId,
          type: 'text',
          text: "네, 알겠습니다. 더 자세한 내용을 알려주시면 도와드리겠습니다.",
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };
        setCurrentTypingId(botResponseId);
        addMessage(botResponse);
      }
    }, 1500);
  },

  // 토글 버튼 클릭
  handleToggleClick: (option) => {
    const { messages, addMessage, removeLoadingMessages, setCurrentTypingId } = get();

    set({ activeToggle: option });

    const userMessage = {
      id: messages.length + 1,
      type: 'text',
      text: option,
      sender: 'user',
      timestamp: new Date(),
      isTyping: false
    };

    addMessage(userMessage);

    const loadingMessage = {
      id: messages.length + 2,
      type: 'loading',
      sender: 'bot',
      timestamp: new Date()
    };
    addMessage(loadingMessage);

    setTimeout(() => {
      removeLoadingMessages();

      let botResponse;

      if (option === '상품추천') {
        botResponse = {
          id: messages.length + 3,
          type: 'product',
          title: '오굿페이 추천 상품',
          description: '고객님께 맞는 상품을 추천해드려요!',
          price: '₩29,900',
          image: 'https://via.placeholder.com/300x200',
          link: 'https://example.com',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: false
        };
      } else if (option === '내 리포트 보기') {
        botResponse = {
          id: messages.length + 3,
          type: 'text',
          text: '고객님의 리포트를 준비하고 있습니다. 잠시만 기다려주세요.',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };
      } else {
        botResponse = {
          id: messages.length + 3,
          type: 'text',
          text: '어떤 도움이 필요하신지 구체적으로 말씀해주세요.',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };
      }

      setCurrentTypingId(botResponse.id);
      addMessage(botResponse);
    }, 1500);
  },

  // 타이핑 애니메이션 완료
  handleTypingComplete: (messageId) => {
    const { updateMessage, setCurrentTypingId } = get();

    setCurrentTypingId(null);
    updateMessage(messageId, { isTyping: false });
  },

  // SSE 연결 관리
  // SSE 연결
  connectSSE: (url) => {
    const { eventSource } = get();

    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource(url);

    newEventSource.onopen = () => {
      set({ connectionStatus: 'connected' });
    };

    newEventSource.onerror = () => {
      set({ connectionStatus: 'error' });
    };

    set({
      sseUrl: url,
      eventSource: newEventSource
    });
  },

  // SSE 해제
  disconnectSSE: () => {
    const { eventSource } = get();

    if (eventSource) {
      eventSource.close();
      set({
        eventSource: null,
        connectionStatus: 'disconnected',
        sseUrl: null
      });
    }
  },

  // SSE 메시지 처리
  handleSSEMessage: (messageId, data) => {
    const { updateMessage } = get();

    if (data.type === 'text_chunk') {
      updateMessage(messageId, (prev) => ({
        text: prev.text + data.content
      }));
    } else if (data.type === 'complete') {
      updateMessage(messageId, {
        isTyping: false,
        isComplete: true
      });
      set({ currentTypingId: null });
    }
  }
}));