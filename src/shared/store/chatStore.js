import { create } from 'zustand';
import chatApi from '../api/chatApi.js';
import { formatMessageForAPI, formatAPIResponseToMessage, generateMessageId, createUserMessage, createLoadingMessage, generateSessionId } from '../utils/messageUtils.js';
import { FLOW_TYPES, getNextFlow } from '../constants/flowTypes.js';

// ZUSTAND를 사용하여 채팅 전역 상태관리
// TODO : 현재는 API 연결 전이라 더미 데이터로 구현
export const useChatStore = create((set, get) => ({
  messages: [],
  inputValue: '',
  activeToggle: '상품추천',
  currentTypingId: null,
  toggleOptions: ['상품추천', '내 리포트 보기', '기타'],

  // API 관련 상태
  customerId: 1,
  sessionId: null,
  currentFlow: FLOW_TYPES.MOODCHECK, // 초기 플로우

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
  handleSendMessage: async () => {
    const { inputValue, messages, addMessage, removeLoadingMessages, setCurrentTypingId, customerId, sessionId, currentFlow } = get();

    if (!inputValue.trim()) return;

    // 세션 ID 초기화 (첫 메시지인 경우)
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      set({ sessionId: currentSessionId });
    }

    // 사용자 메시지 추가
    const userMessageId = generateMessageId();
    const userMessage = createUserMessage(inputValue, userMessageId);
    addMessage(userMessage);

    // 로딩 메시지 추가
    const loadingMessageId = generateMessageId();
    const loadingMessage = createLoadingMessage(loadingMessageId);
    addMessage(loadingMessage);

    // 입력창 초기화
    set({ inputValue: '' });

    try {
      // API 요청 데이터 포맷팅 (현재 플로우 사용)
      const apiRequest = formatMessageForAPI(inputValue, currentFlow, customerId, currentSessionId);

      // API 호출
      const response = await chatApi.sendChatMessage(apiRequest);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 봇 응답 메시지 생성
      const botMessageId = generateMessageId();
      const botMessage = formatAPIResponseToMessage(response, botMessageId);

      if (botMessage.isTyping) {
        setCurrentTypingId(botMessageId);
      }

      addMessage(botMessage);

      // 성공적인 응답 후 다음 플로우로 진행 (응답이 성공인 경우만)
      if (response.success) {
        const nextFlow = getNextFlow(currentFlow);
        set({ currentFlow: nextFlow });

        // 응답에 sessionId가 있으면 업데이트
        if (response.data && response.data.sessionId) {
          set({ sessionId: response.data.sessionId });
        }
      }

    } catch (error) {
      console.error('API 호출 실패:', error);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 에러 메시지 표시
      const errorMessageId = generateMessageId();
      const errorMessage = {
        id: errorMessageId,
        type: 'text',
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(errorMessage);
    }
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

  // 초기 채팅 시작 (첫 진입시 호출)
  initializeChat: async () => {
    const { addMessage, removeLoadingMessages, setCurrentTypingId, customerId, sessionId, currentFlow } = get();

    // 이미 메시지가 있으면 초기화하지 않음
    if (get().messages.length > 0) return;

    try {
      // 세션 ID 초기화
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = generateSessionId();
        set({ sessionId: currentSessionId });
      }

      // 로딩 메시지 추가
      const loadingMessageId = generateMessageId();
      const loadingMessage = createLoadingMessage(loadingMessageId);
      addMessage(loadingMessage);

      // 초기 API 요청 (빈 메시지, mood_check 플로우)
      const apiRequest = formatMessageForAPI("", currentFlow, customerId, currentSessionId);

      console.log('🎬 초기 채팅 시작:', apiRequest);

      // API 호출
      const response = await chatApi.sendChatMessage(apiRequest);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 봇 응답 메시지 생성
      const botMessageId = generateMessageId();
      const botMessage = formatAPIResponseToMessage(response, botMessageId);

      if (botMessage.isTyping) {
        setCurrentTypingId(botMessageId);
      }

      addMessage(botMessage);

      // 성공적인 응답 후 다음 플로우로 진행
      if (response.success) {
        const nextFlow = getNextFlow(currentFlow);
        set({ currentFlow: nextFlow });

        // 응답에 sessionId가 있으면 업데이트
        if (response.data && response.data.sessionId) {
          set({ sessionId: response.data.sessionId });
        }
      }

    } catch (error) {
      console.error('초기 채팅 시작 실패:', error);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 에러 메시지 표시
      const errorMessageId = generateMessageId();
      const errorMessage = {
        id: errorMessageId,
        type: 'text',
        text: '죄송합니다. 채팅을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(errorMessage);
    }
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