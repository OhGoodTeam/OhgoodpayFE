// 사용자 입력을 분석하여 적절한 플로우로 분기하는 유틸리티

// 질문 키워드 매핑
const QUESTION_KEYWORDS = {
  '오굿 스코어': '오굿 스코어 기준',
  '스코어': '오굿 스코어 기준',
  '점수': '오굿 스코어 기준',
  '연체': '연체 패널티',
  '패널티': '연체 패널티',
  '벌금': '연체 패널티',
  'BNPL': 'BNPL 이란?',
  'bnpl': 'BNPL 이란?',
  '분할': 'BNPL 이란?',
  '연장': '기간 연장',
  '기간': '기간 연장',
  '납부': '즉시 납부 플로우',
  '결제': '즉시 납부 플로우',
  '정지': '계정 정지 해제법',
  '계정': '계정 정지 해제법',
  '해제': '계정 정지 해제법',
  '포인트': '포인트',
  '적립': '포인트'
};

// 기분 관련 키워드
const MOOD_KEYWORDS = [
  '좋다', '좋아', '기분좋아', '행복', '신나', '즐거워', '좋은',
  '그저그래', '보통', '평범', '괜찮아', '그냥', '그럭저럭',
  '안좋아', '안좋', '나쁜', '나쁘', '우울', '슬퍼', '슬픈', '짜증', '화나', '스트레스', '기분나쁨', '기분안좋'
];

// 추천 관련 키워드
const RECOMMENDATION_KEYWORDS = [
  '추천', '상품', '제품', '뭐가좋아', '골라줘', '찾아줘', '추천해줘'
];

// 일반 질문 의도 키워드
const GENERAL_QUESTION_KEYWORDS = [
  '질문', '궁금', '물어볼', '알고싶어', '뭐야', '어떻게', '어디서',
  '언제', '왜', '무엇', '어떤', '설명', '알려줘', '가르쳐줘'
];

// 처음으로 돌아가기 관련 키워드
const RESET_KEYWORDS = [
  '처음으로', '처음', '다시', '초기화', '리셋', 'reset', '돌아가', '되돌아',
  '다른게궁금', '다른거궁금', '다른 게 궁금', '다른 거 궁금', '다른질문', '다른 질문',
  '새로', '바꿔', '변경', '처음부터', '다시시작', '다시 시작'
];

/**
 * 사용자 입력을 분석하여 플로우 타입을 결정
 * @param {string} input - 사용자 입력 텍스트
 * @param {string} currentFlow - 현재 채팅 플로우
 * @returns {object} - { flowType, matchedKeyword, confidence, isDirectAnswer }
 */
export const analyzeUserInput = (input, currentFlow = null) => {
  const normalizedInput = input.toLowerCase().trim();
  console.log('=== analyzeUserInput 시작 ===');
  console.log('입력:', input, '현재플로우:', currentFlow);

  // 1. 리셋/처음으로 키워드 체크 (최우선)
  const resetMatch = RESET_KEYWORDS.find(keyword =>
    normalizedInput.includes(keyword)
  );
  if (resetMatch) {
    return {
      flowType: 'reset',
      matchedKeyword: resetMatch,
      confidence: 'high',
      isDirectAnswer: true
    };
  }

  // 2. 구체적인 질문 키워드 체크 (정확도 높음) - 바로 답변
  for (const [keyword, questionType] of Object.entries(QUESTION_KEYWORDS)) {
    if (normalizedInput.includes(keyword.toLowerCase())) {
      return {
        flowType: 'question',
        matchedKeyword: questionType,
        confidence: 'high',
        isDirectAnswer: true // 바로 답변
      };
    }
  }

  // 3. 현재 플로우와의 일치성 검사 (플로우 미스매치 감지) - 우선순위 높음
  if (currentFlow && currentFlow !== 'init') {
    console.log('플로우 미스매치 검사 - 현재 플로우:', currentFlow, '입력:', normalizedInput);

    // question 플로우에서 기분/추천 키워드 입력시
    if (currentFlow === 'question') {
      const moodOrRecommendMatch = [...MOOD_KEYWORDS, ...RECOMMENDATION_KEYWORDS].find(keyword =>
        normalizedInput.includes(keyword)
      );
      console.log('question 플로우에서 기분/추천 키워드 매칭:', moodOrRecommendMatch);
      if (moodOrRecommendMatch) {
        return {
          flowType: 'flow_mismatch',
          matchedKeyword: 'mood_in_question_flow',
          confidence: 'high',
          suggestedFlow: 'start'
        };
      }
    }

    // question이 아닌 플로우에서 질문 키워드 입력시
    if (currentFlow !== 'question') {
      const questionMatch = [...Object.keys(QUESTION_KEYWORDS), ...GENERAL_QUESTION_KEYWORDS].find(keyword =>
        normalizedInput.includes(keyword.toLowerCase())
      );
      console.log('non-question 플로우에서 질문 키워드 매칭:', questionMatch);
      if (questionMatch) {
        return {
          flowType: 'flow_mismatch',
          matchedKeyword: 'question_in_other_flow',
          confidence: 'high',
          suggestedFlow: 'question'
        };
      }
    }
  }

  // 4. 일반 질문 의도 감지 - 질문 플로우로 안내
  const generalQuestionMatch = GENERAL_QUESTION_KEYWORDS.find(keyword =>
    normalizedInput.includes(keyword)
  );
  if (generalQuestionMatch) {
    return {
      flowType: 'question',
      matchedKeyword: generalQuestionMatch,
      confidence: 'high',
      isDirectAnswer: false // 질문 선택 토글 보여주기
    };
  }

  // 5. 기분 키워드 체크
  const moodMatch = MOOD_KEYWORDS.find(keyword =>
    normalizedInput.includes(keyword)
  );
  if (moodMatch) {
    return {
      flowType: 'start',
      matchedKeyword: moodMatch,
      confidence: 'high',
      isDirectAnswer: false
    };
  }

  // 6. 추천 키워드 체크
  const recommendMatch = RECOMMENDATION_KEYWORDS.find(keyword =>
    normalizedInput.includes(keyword)
  );
  if (recommendMatch) {
    return {
      flowType: 'start', // 추천 요청도 기분 체크부터 시작
      matchedKeyword: recommendMatch,
      confidence: 'medium',
      isDirectAnswer: false
    };
  }

  // 7. 기본값: 입력 길이와 패턴에 따른 판단
  if (normalizedInput.includes('?') || normalizedInput.includes('？')) {
    // 물음표가 있으면 질문일 가능성 높음
    return {
      flowType: 'question',
      matchedKeyword: null,
      confidence: 'medium',
      isDirectAnswer: false
    };
  }


  if (normalizedInput.length < 10) {
    // 짧은 입력은 기분 표현일 가능성 높음
    return {
      flowType: 'start',
      matchedKeyword: null,
      confidence: 'low',
      isDirectAnswer: false
    };
  } else {
    // 긴 입력은 질문일 가능성 높음
    return {
      flowType: 'question',
      matchedKeyword: null,
      confidence: 'low',
      isDirectAnswer: false
    };
  }
};

/**
 * 질문 플로우용 답변 생성
 * @param {string} questionType - 질문 타입
 * @returns {string} - 답변 텍스트
 */
export const getQuestionAnswer = (questionType) => {
  const answers = {
    '오굿 스코어 기준': `오굿 스코어는 다음 기준으로 산정됩니다:
  
  📊 **주요 평가 요소**
  • 결제 이력 (40%) - 정시 결제율, 연체 횟수
  • 이용 실적 (30%) - 서비스 이용 빈도, 금액
  • 신용도 (20%) - 타 금융기관 신용정보
  • 기타 (10%) - 가입 기간, 개인정보 완성도
  
  🎯 **점수 구간**
  • 900~1000점: 최우수 등급
  • 800~899점: 우수 등급
  • 700~799점: 보통 등급
  • 600~699점: 주의 등급`,

      '연체 패널티': `연체 패널티 안내입니다:
  
  ⚠️ **연체 패널티**
  • 연체 1일차: 연체료 부과 시작
  • 연체 3일: SMS 알림 발송
  • 연체 7일: 서비스 이용 제한
  • 연체 14일: 계정 정지
  
  💰 **연체료 계산**
  • 연체금액 × 연체일수 × 연체이율(연 20%)
  • 최소 연체료: 1,000원
  
  🔄 **해결 방법**
  • 즉시 납부 시 연체 해제
  • 분할 납부 상담 가능`,

      'BNPL 이란?': `BNPL(Buy Now, Pay Later) 서비스 안내:
  
  💳 **BNPL이란?**
  • "지금 구매, 나중 결제" 서비스
  • 상품 구매 후 분할 결제 가능
  • 신용카드 없이도 이용 가능
  
  ✅ **이용 방법**
  1. 온라인 쇼핑몰에서 BNPL 선택
  2. 간단한 본인인증
  3. 분할 결제 계획 선택
  4. 즉시 상품 주문 완료
  
  📅 **결제 옵션**
  • 2개월 무이자 분할
  • 3~12개월 저금리 분할
  • 다음 달 일시 결제`,

      '기간 연장': `결제 기간 연장 신청 방법:
  
  📱 **연장 신청 방법**
  1. 오굿페이 앱 → 마이페이지
  2. '결제 관리' → '기간 연장 신청'
  3. 연장 사유 선택 및 작성
  4. 신청서 제출
  
  ⏰ **연장 가능 기간**
  • 최대 30일까지 연장 가능
  • 월 1회 연장 신청 가능
  • 연체 이력 고려하여 승인
  
  💡 **연장 시 주의사항**
  • 연장료 별도 부과 가능
  • 오굿 스코어에 영향
  • 연장 중 추가 이용 제한`,

      '즉시 납부 플로우': `즉시 납부 방법 안내:
  
  💳 **납부 방법**
  1. **오굿페이 앱**
     • 마이페이지 → 미납 내역
     • '즉시 납부' 버튼 클릭
  
  2. **계좌 이체**
     • 등록된 계좌에서 자동 이체
     • 수동 이체도 가능
  
  3. **카드 결제**
     • 신용/체크카드 결제
     • 간편결제 서비스 이용
  
  ⚡ **즉시 반영**
  • 결제 완료 후 5분 내 반영
  • SMS 알림 발송
  • 서비스 이용 즉시 재개`,

      '계정 정지 해제법': `계정 정지 해제 방법:
  
  🔓 **해제 절차**
  1. **미납금 완납**
     • 모든 연체금액 결제
     • 연체료 포함 완납 필요
  
  2. **고객센터 연락**
     • 전화: 1588-1234
     • 채팅 상담 이용 가능
  
  3. **해제 신청**
     • 정지 해제 신청서 작성
     • 향후 계획서 제출
  
  ⏱️ **처리 시간**
  • 완납 확인 후 1~2시간
  • 영업시간 내 처리
  • 해제 완료 시 SMS 발송`,

      '포인트': `오굿 포인트 시스템 안내:
  
  🎁 **포인트 적립**
  • 결제 완료 시: 결제금액의 0.5%
  • 정시 결제 보너스: 추가 100P
  • 친구 추천: 5,000P
  • 리뷰 작성: 500P
  
  💎 **포인트 사용**
  • 다음 결제 시 현금처럼 사용
  • 1P = 1원 가치
  • 최소 1,000P부터 사용 가능
  
  📊 **포인트 확인**
  • 오굿페이 앱 → 마이페이지
  • 포인트 적립/사용 내역 확인
  • 유효기간: 적립일로부터 2년`
  };

  return answers[questionType] || '죄송합니다. 해당 질문에 대한 답변을 찾을 수 없습니다. 고객센터(1588-1234)로 문의해 주세요.';
};