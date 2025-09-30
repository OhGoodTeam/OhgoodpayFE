import { create } from 'zustand';
import chatApi from '../api/chatApi.js';
import { formatMessageForAPI, formatAPIResponseToMessage, generateMessageId, createUserMessage, createLoadingMessage, generateSessionId } from '../utils/messageUtils.js';
import { getToggleOptionsByFlow } from '../../features/recommend/util/flowTypes.js';
import { analyzeUserInput, getQuestionAnswer } from '../utils/inputAnalyzer.js';

// localStorage 키
const SESSION_STORAGE_KEY = 'chat_session_id';

// localStorage에서 세션 ID 가져오기
const getStoredSessionId = () => {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('localStorage에서 세션 ID 가져오기 실패:', error);
    return null;
  }
};

// localStorage에 세션 ID 저장
const setStoredSessionId = (sessionId) => {
  try {
    if (sessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    console.error('localStorage에 세션 ID 저장 실패:', error);
  }
};

// ZUSTAND를 사용하여 채팅 전역 상태관리
export const useChatStore = create((set, get) => ({
  messages: [],
  inputValue: '',
  activeToggle: '',
  currentTypingId: null,
  toggleOptions: [], // 초기에는 빈 배열
  currentFlow: null,
  previousFlow: null, // flow_mismatch 이전의 플로우 저장
  previousUserMessage: null, // flow_mismatch 이전의 사용자 입력 저장
  lastRequestFlow: null, // 마지막 API 요청 시의 플로우
  lastRequestMessage: null, // 마지막 API 요청 시의 사용자 입력
  isLoading: false, // API 호출 중인지 여부
  isTyping: false, // 타이핑 중인지 여부
  pendingToggleOptions: null, // 타이핑 완료 후 적용할 토글 옵션
  pendingFlow: null, // 타이핑 완료 후 적용할 플로우

  sessionId: null,

  // SSE 관련 상태
  sseUrl: null,
  eventSource: null,
  connectionStatus: 'disconnected',

  setInputValue: (value) => set({ inputValue: value }),

  setActiveToggle: (toggle) => set({ activeToggle: toggle }),

  setCurrentTypingId: (id) => set({ currentTypingId: id }),

  // 플로우 기반 토글 옵션 업데이트 (타이핑 완료 후 적용)
  updateToggleOptions: (flow) => {
    const newOptions = getToggleOptionsByFlow(flow);
    const { isTyping, isLoading } = get();

    // 타이핑 중이거나 로딩 중이면 옵션을 저장만 하고 표시하지 않음
    if (isTyping || isLoading) {
      set({
        pendingToggleOptions: newOptions,
        pendingFlow: flow
      });
    } else {
      set({
        toggleOptions: newOptions,
        currentFlow: flow,
        activeToggle: null // 기본 활성화 제거
      });
    }
  },

  // 대기 중인 토글 옵션 적용 - 응답 대기시 토글 누르지 못하도록 하기 위함이다.
  applyPendingToggleOptions: () => {
    const { pendingToggleOptions, pendingFlow } = get();

    if (pendingToggleOptions && pendingFlow) {
      set({
        toggleOptions: pendingToggleOptions,
        currentFlow: pendingFlow,
        activeToggle: null, // 기본 활성화 제거
        pendingToggleOptions: null,
        pendingFlow: null
      });
    }
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
    const { inputValue, addMessage, removeLoadingMessages, setCurrentTypingId, sessionId, isLoading } = get();

    if (!inputValue.trim() || isLoading) return;

    // 로딩 상태 시작
    set({ isLoading: true });

    // 세션 ID 초기화 (첫 메시지인 경우)
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      set({ sessionId: currentSessionId });
      setStoredSessionId(currentSessionId);
    }

    // 사용자 메시지 추가
    const userMessageId = generateMessageId();
    const userMessage = createUserMessage(inputValue, userMessageId);
    addMessage(userMessage);

    // 사용자 입력 분석 (현재 플로우 정보 포함)
    const { currentFlow } = get();
    const analysis = analyzeUserInput(inputValue, currentFlow);

    // 분석 결과에 따라 플로우 설정 (토글은 답변 완료 후 업데이트)
    if (analysis.flowType === 'question') {
      set({ currentFlow: 'question' });
      console.log('질문 분석 결과 - 플로우를 question으로 변경');
    } else if (analysis.flowType === 'start') {
      set({ currentFlow: 'start' });
      console.log('추천 분석 결과 - 플로우를 start로 변경');
    }

    // 입력창 초기화
    set({ inputValue: '' });

    // 플로우에 따른 처리 분기
    if (analysis.flowType === 'flow_mismatch') {
      // 플로우 미스매치 - 선택지 제공
      setTimeout(() => {
        const mismatchMessageId = generateMessageId();
        const mismatchMessage = {
          id: mismatchMessageId,
          type: 'text',
          text: '음... 지금 대화 흐름과 좀 다른 것 같은데? 🤔\n어떻게 할까?',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };

        get().setCurrentTypingId(mismatchMessageId);
        // flow_mismatch로 변경하기 전에 요청 시점의 플로우와 사용자 입력을 저장
        const { lastRequestFlow, lastRequestMessage } = get();
        set({
          isTyping: true,
          currentFlow: 'flow_mismatch',
          previousFlow: lastRequestFlow,
          previousUserMessage: lastRequestMessage
        });
        get().addMessage(mismatchMessage);

        // 타이핑 효과 제거 후 토글 표시
        setTimeout(() => {
          set({
            isLoading: false,
            isTyping: false,
            currentTypingId: null
          });

          get().updateMessage(mismatchMessageId, { isTyping: false });
          // 플로우 미스매치 토글 옵션 설정
          get().updateToggleOptions('flow_mismatch');
        }, 1500);
      }, 800);
      return;
    }

    if (analysis.flowType === 'quickmenu') {
      // 퀵메뉴 처리 - 즉시 메뉴 제공
      setTimeout(() => {
        const quickMenuMessageId = generateMessageId();
        const quickMenuMessage = {
          id: quickMenuMessageId,
          type: 'quickmenu',
          menuInfo: analysis.menuInfo,
          sender: 'bot',
          timestamp: new Date(),
          isTyping: false
        };

        get().addMessage(quickMenuMessage);

        // 로딩 상태 종료
        set({ isLoading: false });
      }, 500);
      return;
    }

    if (analysis.flowType === 'reset') {
      // 처음으로 돌아가기 - 바로 봇 응답과 리셋 처리
      setTimeout(() => {
        const resetMessageId = generateMessageId();
        const resetMessage = {
          id: resetMessageId,
          type: 'text',
          text: '다시 처음으로 되돌아갈께! 😊\n오늘은 뭐가 궁금해?',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };

        get().setCurrentTypingId(resetMessageId);
        set({ isTyping: true });
        get().addMessage(resetMessage);

        // 타이핑 효과 제거 및 init 상태로 변경
        setTimeout(async () => {
          set({
            currentFlow: 'init',
            isLoading: false,
            isTyping: false,
            currentTypingId: null,
            activeToggle: null
          });

          // 세션 초기화 API 호출
          try {
            const { sessionId } = get();
            if (sessionId) {
              await chatApi.clearSession(sessionId);
              console.log('세션이 초기화되었습니다.');
            }
          } catch (error) {
            console.error('세션 초기화 실패:', error);
          }

          // init 토글 옵션 설정
          get().updateToggleOptions('init');
        }, 1500);
      }, 800);
      return;
    }

    if (analysis.flowType === 'keep_current_flow') {
      // 현재 플로우 유지 - 서버에 이전 플로우 복원 요청
      setTimeout(async () => {
        const keepFlowMessageId = generateMessageId();
        const keepFlowMessage = {
          id: keepFlowMessageId,
          type: 'text',
          text: '알겠어! 계속 진행해보자~ 😊',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };

        get().setCurrentTypingId(keepFlowMessageId);
        set({ isTyping: true });
        get().addMessage(keepFlowMessage);

        // 타이핑 효과 제거 후 서버에 플로우 복원 요청
        setTimeout(async () => {
          set({
            isTyping: false,
            currentTypingId: null
          });

          get().updateMessage(keepFlowMessageId, { isTyping: false });

          try {
            // 로딩 메시지 추가
            const loadingMessageId = generateMessageId();
            const loadingMessage = createLoadingMessage(loadingMessageId);
            get().addMessage(loadingMessage);

            // 서버에 플로우 복원 요청 (이전 플로우 + 이전 사용자 입력으로 복원)
            const { sessionId, previousFlow, previousUserMessage } = get();
            const apiRequest = formatMessageForAPI(previousUserMessage || '', sessionId, previousFlow);
            const response = await chatApi.sendChatMessage(apiRequest);

            // 로딩 메시지 제거
            get().removeLoadingMessages();

            // 서버 응답 처리
            if (response.success && response.data) {
              // 서버 메시지가 있으면 봇 메시지로 추가
              if (response.data.message) {
                const botMessageId = generateMessageId();
                const botMessage = {
                  id: botMessageId,
                  type: 'text',
                  text: response.data.message,
                  sender: 'bot',
                  timestamp: new Date(),
                  isTyping: true
                };

                get().setCurrentTypingId(botMessageId);
                set({ isTyping: true });
                get().addMessage(botMessage);

                // 타이핑 완료 후 플로우 업데이트
                setTimeout(() => {
                  set({
                    isTyping: false,
                    currentTypingId: null
                  });

                  get().updateMessage(botMessageId, { isTyping: false });

                  // 서버 응답의 플로우 또는 이전 플로우로 복원
                  const flowToRestore = response.data.flow || get().previousFlow;
                  if (flowToRestore) {
                    set({ currentFlow: flowToRestore, previousFlow: null, previousUserMessage: null });
                    get().updateToggleOptions(flowToRestore);
                  }
                }, 1500);
              } else {
                // 메시지 없는 경우 - 서버 응답의 플로우 또는 이전 플로우로 복원
                const flowToRestore = (response.data && response.data.flow) || get().previousFlow;
                if (flowToRestore) {
                  set({ currentFlow: flowToRestore, previousFlow: null, previousUserMessage: null });
                  get().updateToggleOptions(flowToRestore);
                }
              }
            }

            set({ isLoading: false });

          } catch (error) {
            console.error('플로우 복원 실패:', error);
            get().removeLoadingMessages();
            set({ isLoading: false });

            // 에러 시 이전 플로우로 복원
            const { previousFlow } = get();
            if (previousFlow) {
              set({ currentFlow: previousFlow, previousFlow: null, previousUserMessage: null });
              get().updateToggleOptions(previousFlow);
            } else {
              // previousFlow가 없는 경우에만 init으로
              set({ currentFlow: 'init' });
              get().updateToggleOptions('init');
            }
          }
        }, 1500);
      }, 800);
      return;
    }

    if (analysis.flowType === 'question') {
      if (analysis.isDirectAnswer) {
        // 구체적인 질문: 바로 답변 제공
        await get().handleDirectAnswer(analysis.matchedKeyword);
      } else {
        // 일반적인 질문 의도: 질문 선택 토글로 안내
        await get().handleQuestionGuide();
      }
      return;
    }

    // start 플로우 (기분/추천 관련): 안내 메시지 후 API 연동
    if (analysis.flowType === 'start') {

      // 안내 메시지 먼저 표시
      setTimeout(() => {
        const guideMessageId = generateMessageId();
        const guideMessage = {
          id: guideMessageId,
          type: 'text',
          text: '오늘 기분으로 알맞은 상품을 추천해줄게~ 😊\n잠시만 기다려줘!',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };

        get().setCurrentTypingId(guideMessageId);
        set({ isTyping: true });
        get().addMessage(guideMessage);

        // 안내 메시지 타이핑 완료 후 API 호출
        setTimeout(async () => {
          set({ isTyping: false, currentTypingId: null });

          // 로딩 메시지 추가
          const loadingMessageId = generateMessageId();
          const loadingMessage = createLoadingMessage(loadingMessageId);
          get().addMessage(loadingMessage);

          try {
            // API 요청 데이터 포맷팅 (currentFlow 포함)
            const requestFlow = 'start';
            set({ lastRequestFlow: requestFlow, lastRequestMessage: inputValue }); // 요청 시점의 플로우와 메시지 저장
            const apiRequest = formatMessageForAPI(inputValue, currentSessionId, requestFlow);

            // API 호출
            const response = await chatApi.sendChatMessage(apiRequest);

            // 로딩 메시지 제거
            get().removeLoadingMessages();

            // 봇 응답 메시지 생성 (기존 로직과 동일)
            const botMessageId = generateMessageId();
            const botMessages = formatAPIResponseToMessage(response, botMessageId);

            // 단일 메시지인 경우와 배열인 경우 처리
            if (Array.isArray(botMessages)) {
              // 상품 리스트인 경우 (각각 별도 메시지) - 순차적으로 추가
              botMessages.forEach((message, index) => {
                setTimeout(() => {
                  if (message.isTyping && index === botMessages.length - 1) {
                    get().setCurrentTypingId(message.id);
                    set({ isTyping: true }); // 전역 타이핑 상태 설정
                  }
                  get().addMessage(message);

                  // 마지막 상품 메시지 추가 후 플로우 업데이트
                  if (index === botMessages.length - 1) {
                    setTimeout(() => {
                      // 성공적인 응답 후 세션 아이디 설정 및 토글 옵션 업데이트
                      if (response.success) {

                        // flow가 있으면 currentFlow와 토글 옵션 업데이트
                        if (response.data && response.data.flow) {
                          set({ currentFlow: response.data.flow });
                          get().updateToggleOptions(response.data.flow);
                        }
                      }
                    }, 100); // 약간의 지연 후 플로우 업데이트
                  }
                }, index * 200); // 200ms 간격으로 순차 추가
              });
            } else {
              // 단일 메시지인 경우
              if (botMessages.isTyping) {
                get().setCurrentTypingId(botMessageId);
                set({ isTyping: true }); // 전역 타이핑 상태 설정
              }
              get().addMessage(botMessages);

              // 성공적인 응답 후 세션 아이디 설정 및 토글 옵션 업데이트
              if (response.success) {

                // flow가 있으면 currentFlow와 토글 옵션 업데이트
                if (response.data && response.data.flow) {
                  set({ currentFlow: response.data.flow });
                  get().updateToggleOptions(response.data.flow);
                }
              }
            }

            // 로딩 상태 종료
            set({ isLoading: false });

          } catch (error) {
            console.error('API 호출 실패:', error);

            // 로딩 메시지 제거
            get().removeLoadingMessages();

            // 로딩 상태 종료
            set({ isLoading: false });

            // 에러 메시지 표시
            const errorMessageId = generateMessageId();
            let errorText = '미안ㅠㅠ 일시적인 오류가 발생했어😅\n잠시 후 다시 시도해줘!';

            // 500번대 서버 에러인 경우 다른 메시지
            if (error.response && error.response.status >= 500) {
              errorText = '서버에서 문제가 발생했어ㅠㅠ\n다시 한번 시도해줄래?😭';
            }

            const errorMessage = {
              id: errorMessageId,
              type: 'text',
              text: errorText,
              sender: 'bot',
              timestamp: new Date(),
              isTyping: false
            };
            get().addMessage(errorMessage);
          }
        }, 1500);
      }, 800);
      return;
    }

    // 로딩 메시지 추가
    const loadingMessageId = generateMessageId();
    const loadingMessage = createLoadingMessage(loadingMessageId);
    addMessage(loadingMessage);

    try {
      // API 요청 데이터 포맷팅 (currentFlow 포함)
      const { currentFlow } = get();
      set({ lastRequestFlow: currentFlow, lastRequestMessage: inputValue }); // 요청 시점의 플로우와 메시지 저장
      const apiRequest = formatMessageForAPI(inputValue, currentSessionId, currentFlow);

      // API 호출
      const response = await chatApi.sendChatMessage(apiRequest);

      // 로딩 메시지 제거
      removeLoadingMessages();

      // 봇 응답 메시지 생성
      const botMessageId = generateMessageId();
      const botMessages = formatAPIResponseToMessage(response, botMessageId);

      // 단일 메시지인 경우와 배열인 경우 처리
      if (Array.isArray(botMessages)) {
        // 상품 리스트인 경우 (각각 별도 메시지) - 순차적으로 추가
        botMessages.forEach((message, index) => {
          setTimeout(() => {
            if (message.isTyping && index === botMessages.length - 1) {
              setCurrentTypingId(message.id);
              set({ isTyping: true }); // 전역 타이핑 상태 설정
            }
            addMessage(message);

            // 마지막 상품 메시지 추가 후 플로우 업데이트
            if (index === botMessages.length - 1) {
              setTimeout(() => {
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
              }, 100); // 약간의 지연 후 플로우 업데이트
            }
          }, index * 200); // 200ms 간격으로 순차 추가
        });
      } else {
        // 단일 메시지인 경우
        if (botMessages.isTyping) {
          setCurrentTypingId(botMessageId);
          set({ isTyping: true }); // 전역 타이핑 상태 설정
        }
        addMessage(botMessages);

        // 성공적인 응답 후 세션 아이디 설정 및 토글 옵션 업데이트
        if (response.success) {

          // flow가 있으면 토글 옵션 업데이트
          if (response.data && response.data.flow) {
            get().updateToggleOptions(response.data.flow);
          }
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
      let errorText = '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.';

      // 500번대 서버 에러인 경우 다른 메시지
      if (error.response && error.response.status >= 500) {
        errorText = '서버에서 문제가 발생했어ㅠㅠ\n다시 한번 시도해줄래?😭';
      }

      const errorMessage = {
        id: errorMessageId,
        type: 'text',
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(errorMessage);
    }
  },

  // 토글 버튼 클릭
  handleToggleClick: async (option) => {
    const { isLoading, handleSendMessage } = get();

    if (isLoading) {
      return;
    }

    // 토글 클릭시 입력창에 텍스트 설정 후 바로 전송
    set({ inputValue: option });

    // 약간의 지연 후 메시지 전송 (상태 업데이트 보장)
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  },

  // 질문 플로우 처리 (클라이언트 사이드)
  handleQuestionFlow: async (option) => {
    const { addMessage, removeLoadingMessages, setCurrentTypingId, currentFlow } = get();

    // 이미 로딩 메시지가 있는지 확인
    const hasLoadingMessage = get().messages.some(msg => msg.type === 'loading');
    if (!hasLoadingMessage) {
      // 로딩 메시지 추가
      const loadingMessageId = generateMessageId();
      const loadingMessage = createLoadingMessage(loadingMessageId);
      addMessage(loadingMessage);
    }

    if (currentFlow === 'init' && option === '자주하는 질문') {
      // 먼저 토글 옵션을 pending으로 설정 (아직 isTyping: false 상태)
      get().updateToggleOptions('question');

      // 초기에서 "자주하는 질문" 선택
      setTimeout(() => {
        removeLoadingMessages();

        const botMessageId = generateMessageId();
        const botMessage = {
          id: botMessageId,
          type: 'text',
          text: '궁금한게 있구나! 🤔\n어떤 것이 궁금해? 아래에서 선택해줘~',
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };

        setCurrentTypingId(botMessageId);
        set({ isTyping: true });
        addMessage(botMessage);

        // 로딩은 타이핑이 끝날 때까지 유지 (타이핑 완료 시 handleTypingComplete에서 해제)
      }, 800);

    } else if (currentFlow === 'question') {
      // 질문 플로우에서 구체적인 질문 선택
      setTimeout(() => {
        removeLoadingMessages();

        const answerText = getQuestionAnswer(option);
        const botMessageId = generateMessageId();
        const botMessage = {
          id: botMessageId,
          type: 'text',
          text: answerText,
          sender: 'bot',
          timestamp: new Date(),
          isTyping: true
        };

        setCurrentTypingId(botMessageId);
        set({ isTyping: true });
        addMessage(botMessage);

        // 질문 토글 옵션은 handleTypingComplete에서 처리됨

        // 로딩은 타이핑이 끝날 때까지 유지 (타이핑 완료 시 handleTypingComplete에서 해제)
      }, 1000);
    }
  },

  // 구체적인 질문에 바로 답변
  handleDirectAnswer: async (questionType) => {
    const { addMessage, setCurrentTypingId } = get();

    // 답변 완료 후 토글 옵션이 적용되도록 pending 설정
    const questionOptions = getToggleOptionsByFlow('question');
    set({
      pendingToggleOptions: questionOptions,
      pendingFlow: 'question'
    });

    // 로딩 메시지 추가
    const loadingMessageId = generateMessageId();
    const loadingMessage = createLoadingMessage(loadingMessageId);
    addMessage(loadingMessage);

    setTimeout(() => {
      // 로딩 메시지 제거
      set((state) => ({
        messages: state.messages.filter(msg => msg.type !== 'loading')
      }));

      const answerText = getQuestionAnswer(questionType);
      const botMessageId = generateMessageId();
      const botMessage = {
        id: botMessageId,
        type: 'text',
        text: answerText,
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true
      };

      setCurrentTypingId(botMessageId);
      set({ isTyping: true });
      addMessage(botMessage);

      // 질문 토글 옵션은 handleTypingComplete에서 처리됨

      // 로딩은 타이핑이 끝날 때까지 유지 (타이핑 완료 시 handleTypingComplete에서 해제)
    }, 1000);
  },

  // 일반 질문 의도 감지 시 안내
  handleQuestionGuide: async () => {
    const { addMessage, setCurrentTypingId } = get();

    // 먼저 플로우를 question으로 설정
    set({ currentFlow: 'question' });

    // 로딩 메시지 추가
    const loadingMessageId = generateMessageId();
    const loadingMessage = createLoadingMessage(loadingMessageId);
    addMessage(loadingMessage);

    setTimeout(() => {
      // 로딩 메시지 제거
      set((state) => ({
        messages: state.messages.filter(msg => msg.type !== 'loading')
      }));

      const botMessageId = generateMessageId();
      const botMessage = {
        id: botMessageId,
        type: 'text',
        text: '궁금한게 있구나! 🤔\n어떤 것이 궁금해? 아래에서 선택해줘~',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true
      };

      setCurrentTypingId(botMessageId);
      set({ isTyping: true });
      addMessage(botMessage);

      // 토글 옵션을 pending으로 설정 (플로우는 이미 설정됨)
      get().updateToggleOptions('question');

      // 로딩은 타이핑이 끝날 때까지 유지 (타이핑 완료 시 handleTypingComplete에서 해제)
    }, 800);
  },

  // 마지막 봇 메시지에 리셋 버튼 추가 (플로우 진입 후)
  // 리셋 버튼 기능 제거됨
  addResetButtonToLastMessage: () => {
    // 더 이상 리셋 버튼을 추가하지 않음
  },

  // 채팅 초기화 (다른 질문하기)
  resetChat: async () => {
    const { setCurrentTypingId } = get();

    // localStorage에서 이전 세션 ID 가져오기 (현재 세션 + 저장된 세션 모두 확인)
    const currentSessionId = get().sessionId;
    const storedSessionId = getStoredSessionId();

    // 현재 세션이 있으면 삭제
    if (currentSessionId) {
      try {
        await chatApi.clearSession(currentSessionId);
        console.log('현재 세션이 초기화되었습니다.');
      } catch (error) {
        console.error('현재 세션 초기화 실패:', error);
      }
    }

    // 저장된 세션이 현재 세션과 다르면 별도로 삭제
    if (storedSessionId && storedSessionId !== currentSessionId) {
      try {
        await chatApi.clearSession(storedSessionId);
        console.log('저장된 세션이 초기화되었습니다.');
      } catch (error) {
        console.error('저장된 세션 초기화 실패:', error);
      }
    }

    // 모든 상태를 초기화하고 새 세션 시작
    const newSessionId = generateSessionId();
    set({
      messages: [],
      inputValue: '',
      isLoading: false,
      isTyping: false,
      currentTypingId: null,
      activeToggle: null,
      toggleOptions: [],
      pendingToggleOptions: null,
      currentFlow: 'init',
      previousFlow: null,
      previousUserMessage: null,
      lastRequestFlow: null,
      lastRequestMessage: null,
      sessionId: newSessionId
    });

    // 새 세션 ID를 localStorage에 저장
    setStoredSessionId(newSessionId);

    // 초기 웰컴 메시지 추가 (initializeChat과 동일)
    const welcomeMessageId = generateMessageId();
    const welcomeMessage = {
      id: welcomeMessageId,
      type: 'text',
      text: '처음부터 다시 시작할게! 😊\n오늘은 어떤걸 원해?',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };

    // 타이핑 효과와 함께 메시지 추가
    setCurrentTypingId(welcomeMessageId);
    set({
      isTyping: true,
      messages: [welcomeMessage]
    });

    // 타이핑 효과 제거 및 초기 토글 옵션 설정
    setTimeout(() => {
      set({
        isTyping: false,
        currentTypingId: null
      });

      // 초기 토글 옵션 설정
      get().updateToggleOptions('init');
    }, 1500);
  },

  // 리셋 버튼 클릭 처리
  handleResetButtonClick: async () => {
    const { addMessage, setCurrentTypingId, isLoading } = get();

    if (isLoading) return;

    // 로딩 상태 시작
    set({ isLoading: true, activeToggle: null });

    // 사용자 메시지 추가
    const userMessageId = generateMessageId();
    const userMessage = createUserMessage('처음으로', userMessageId);
    addMessage(userMessage);

    // 약간의 지연 후 봇 응답
    setTimeout(() => {
      // 초기화 메시지 추가
      const resetMessageId = generateMessageId();
      const resetMessage = {
        id: resetMessageId,
        type: 'text',
        text: '다시 처음으로 되돌아갈께! 😊\n오늘은 뭐가 궁금해?',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true
      };

      setCurrentTypingId(resetMessageId);
      set({ isTyping: true });
      addMessage(resetMessage);

      // 타이핑 효과 제거 및 init 상태로 변경
      setTimeout(async () => {
        set({
          currentFlow: 'init',
          isLoading: false,
          isTyping: false,
          currentTypingId: null,
          activeToggle: null
        });

        // 세션 초기화 API 호출
        try {
          const { sessionId } = get();
          if (sessionId) {
            await chatApi.clearSession(sessionId);
            console.log('세션이 초기화되었습니다.');
          }
        } catch (error) {
          console.error('세션 초기화 실패:', error);
        }

        // init 토글 옵션 설정
        get().updateToggleOptions('init');
      }, 1500);
    }, 800);
  },

  // 타이핑 애니메이션 완료
  handleTypingComplete: (messageId) => {
    const { updateMessage, setCurrentTypingId, applyPendingToggleOptions } = get();

    setCurrentTypingId(null);
    updateMessage(messageId, { isTyping: false });

    // 1. isTyping을 먼저 false로 설정하여 토글 옵션이 즉시 적용되도록 함
    set({
      isTyping: false,
      isLoading: false // 로딩도 함께 해제하여 토글 옵션이 바로 적용되도록
    });

    // 2. 토글 옵션 즉시 적용 - pending이 있으면 pending을 우선 적용
    applyPendingToggleOptions();

    // 리셋 버튼 제거됨
  },

  // 초기 채팅 시작 (첫 진입시 호출), llm 연동 상품 추천으로 갈지, 아니면 퀵메뉴나 질문으로 갈지를 구분한다.
  initializeChat: async () => {
    const { addMessage, setCurrentTypingId } = get();

    // 이미 메시지가 있으면 초기화하지 않음
    if (get().messages.length > 0) return;

    try {
      // localStorage에서 이전 세션 ID 확인 후 삭제
      const storedSessionId = getStoredSessionId();
      if (storedSessionId) {
        try {
          await chatApi.clearSession(storedSessionId);
          console.log('저장된 이전 세션이 삭제되었습니다.');
        } catch (error) {
          console.error('저장된 세션 삭제 실패:', error);
        }
      }

      // 새로운 세션 ID 생성
      const newSessionId = generateSessionId();
      set({ sessionId: newSessionId });
      setStoredSessionId(newSessionId);

      // 초기 웰컴 메시지 (프론트에서 바로 생성)
      const welcomeMessageId = generateMessageId();
      const welcomeMessage = {
        id: welcomeMessageId,
        type: 'text',
        text: '안녕! 너의 개인 도우미 오레이봉봉 이야~\n오늘은 어떤걸 원해? 😊',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true
      };

      // 타이핑 효과와 함께 메시지 추가
      setCurrentTypingId(welcomeMessageId);
      set({ isTyping: true });
      addMessage(welcomeMessage);

      // 타이핑 효과 제거 (1.5초 후)
      setTimeout(() => {
        set({
          isTyping: false,
          currentTypingId: null
        });
      }, 1500);

      // 초기 토글 옵션 설정 (기분입력 + 퀵메뉴 활성화)
      get().updateToggleOptions('init');

    } catch (error) {
      console.error('초기 채팅 시작 실패:', error);

      // 에러 메시지 표시
      const errorMessageId = generateMessageId();
      let errorText = '죄송합니다. 채팅을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.';

      // 500번대 서버 에러인 경우 다른 메시지
      if (error.response && error.response.status >= 500) {
        errorText = '서버에서 문제가 발생했어ㅠㅠ\n다시 한번 시도해줄래?😭';
      }

      const errorMessage = {
        id: errorMessageId,
        type: 'text',
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(errorMessage);
    }
  },
}));