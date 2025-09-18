import { create } from 'zustand';
import chatApi from '../api/chatApi.js';
import { formatMessageForAPI, formatAPIResponseToMessage, generateMessageId, createUserMessage, createLoadingMessage, generateSessionId } from '../utils/messageUtils.js';
import { getToggleOptionsByFlow } from '../../features/recommend/util/flowTypes.js';

// ZUSTAND를 사용하여 채팅 전역 상태관리
export const useChatStore = create((set, get) => ({
  messages: [],
  inputValue: '',
  activeToggle: '',
  currentTypingId: null,
  toggleOptions: [], // 초기에는 빈 배열
  currentFlow: null,
  isLoading: false, // API 호출 중인지 여부

  // API 관련 상태
  customerId: 1,
  sessionId: null,

  // SSE 관련 상태
  sseUrl: null,
  eventSource: null,
  connectionStatus: 'disconnected',

  setInputValue: (value) => set({ inputValue: value }),

  setActiveToggle: (toggle) => set({ activeToggle: toggle }),

  setCurrentTypingId: (id) => set({ currentTypingId: id }),

  // 플로우 기반 토글 옵션 업데이트
  updateToggleOptions: (flow) => {
    const newOptions = getToggleOptionsByFlow(flow);
    set({
      toggleOptions: newOptions,
      currentFlow: flow,
      activeToggle: newOptions[0] // 첫 번째 옵션을 기본값으로 설정
    });
  },

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
    const { inputValue, addMessage, removeLoadingMessages, setCurrentTypingId, customerId, sessionId, isLoading } = get();

    if (!inputValue.trim() || isLoading) return;

    // 로딩 상태 시작
    set({ isLoading: true });

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
      // API 요청 데이터 포맷팅
      const apiRequest = formatMessageForAPI(inputValue, customerId, currentSessionId);

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

      // 성공적인 응답 후 세션 아이디 설정 및 토글 옵션 업데이트
      if (response.success) {
        if (response.data && response.data.sessionId) {
          set({ sessionId: response.data.sessionId });
        }

        // flow가 있으면 토글 옵션 업데이트
        if (response.data && response.data.flow) {
          get().updateToggleOptions(response.data.flow);
        }
      }

      // 로딩 상태 종료
      set({ isLoading: false });

    } catch (error) {
      console.error('API 호출 실패:', error);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 로딩 상태 종료
      set({ isLoading: false });

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
  handleToggleClick: async (option) => {
    const { addMessage, removeLoadingMessages, setCurrentTypingId, customerId, sessionId, isLoading } = get();

    if (isLoading) return;

    // 로딩 상태 시작
    set({ isLoading: true, activeToggle: option });

    // 사용자 메시지 추가
    const userMessageId = generateMessageId();
    const userMessage = createUserMessage(option, userMessageId);
    addMessage(userMessage);

    // 로딩 메시지 추가
    const loadingMessageId = generateMessageId();
    const loadingMessage = createLoadingMessage(loadingMessageId);
    addMessage(loadingMessage);

    try {
      // API 요청 데이터 포맷팅 (토글 선택값을 inputMessage로 전송)
      const apiRequest = formatMessageForAPI(option, customerId, sessionId);

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

      // 성공적인 응답 후 세션 아이디 설정 및 토글 옵션 업데이트
      if (response.success) {
        if (response.data && response.data.sessionId) {
          set({ sessionId: response.data.sessionId });
        }

        // flow가 있으면 토글 옵션 업데이트
        if (response.data && response.data.flow) {
          get().updateToggleOptions(response.data.flow);
        }
      }

      // 로딩 상태 종료
      set({ isLoading: false });

    } catch (error) {
      console.error('토글 API 호출 실패:', error);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 로딩 상태 종료
      set({ isLoading: false });

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

  // 타이핑 애니메이션 완료
  handleTypingComplete: (messageId) => {
    const { updateMessage, setCurrentTypingId } = get();

    setCurrentTypingId(null);
    updateMessage(messageId, { isTyping: false });
  },

  // 초기 채팅 시작 (첫 진입시 호출)
  initializeChat: async () => {
    const { addMessage, removeLoadingMessages, setCurrentTypingId, customerId, sessionId, isLoading } = get();

    // 이미 메시지가 있거나 로딩 중이면 초기화하지 않음
    if (get().messages.length > 0 || isLoading) return;

    // 로딩 상태 시작
    set({ isLoading: true });

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

      // 초기 API 요청 (빈 메시지)
      const apiRequest = formatMessageForAPI("", customerId, currentSessionId);

      console.log('초기 채팅 시작:', apiRequest);

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

      // 성공적인 응답 후 세션 업데이트 및 토글 옵션 업데이트
      if (response.success) {
        // 응답에 sessionId가 있으면 업데이트
        if (response.data && response.data.sessionId) {
          set({ sessionId: response.data.sessionId });
        }

        // flow가 있으면 토글 옵션 업데이트
        if (response.data && response.data.flow) {
          get().updateToggleOptions(response.data.flow);
        }
      }

      // 로딩 상태 종료
      set({ isLoading: false });

    } catch (error) {
      console.error('초기 채팅 시작 실패:', error);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 로딩 상태 종료
      set({ isLoading: false });

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