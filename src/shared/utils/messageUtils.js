// 메시지 관련 유틸리티 함수들

// 고유한 메시지 ID 생성
export const generateMessageId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// 메시지 데이터 포맷팅 (API 전송용)
export const formatMessageForAPI = (message, sessionId = null) => {
  return {
    sessionId: sessionId || generateSessionId(),
    inputMessage: message || ""
  };
};

// 세션 ID 생성 - 챗봇에서 redis에 세션별 구분시 사용한다.
// TODO : crypto uuid 변환 필요
export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// API 응답을 메시지 객체로 변환
export const formatAPIResponseToMessage = (response, messageId) => {
  console.log('API 응답 전체:', response);
  // 백엔드 응답 구조에 맞게 파싱
  if (response.success && response.data) {
    const { data } = response;
    console.log('응답 데이터:', data);

    // 상품이 있는 경우 (RECOMMENDATION 플로우) - 각 상품마다 별도 메시지 생성
    if (data.products && data.products.length > 0) {
      console.log('상품 데이터 처리:', data.products);
      // 상품들을 각각 별도 메시지로 반환
      return data.products.map((product, index) => ({
        id: messageId + '_' + index,
        type: 'product',
        title: product.name,
        price: `₩${product.price.toLocaleString()}`,
        image: product.image,
        link: product.url,
        category: product.category,
        sender: 'bot',
        timestamp: new Date(),
        isTyping: false
      }));
    }

    // 기본 텍스트 메시지 (data.message 사용)
    return {
      id: messageId,
      type: 'text',
      text: data.message || '응답을 받을 수 없습니다.',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
  }

  // 에러 응답 처리
  return {
    id: messageId,
    type: 'text',
    text: response.message || '응답을 받을 수 없습니다.',
    sender: 'bot',
    timestamp: new Date(),
    isTyping: false
  };
};

// 로딩 메시지 생성
export const createLoadingMessage = (messageId) => {
  return {
    id: messageId,
    type: 'loading',
    sender: 'bot',
    timestamp: new Date()
  };
};

// 사용자 메시지 생성
export const createUserMessage = (text, messageId) => {
  return {
    id: messageId,
    type: 'text',
    text: text,
    sender: 'user',
    timestamp: new Date(),
    isTyping: false
  };
};