// 사용자 입력을 분석하여 적절한 플로우로 분기하는 유틸리티

// 질문 키워드 매핑 (동일 의도에 다수 키워드 매핑)
const QUESTION_KEYWORDS = {
  // ===== 오굿 스코어 기준 =====
  '오굿 스코어': '오굿 스코어 기준',
  '오굿스코어': '오굿 스코어 기준',
  '오굿': '오굿 스코어 기준',
  '스코어': '오굿 스코어 기준',
  '점수': '오굿 스코어 기준',
  '신용점수': '오굿 스코어 기준',     // 유저가 흔히 이렇게 말함
  '평점': '오굿 스코어 기준',
  '등급': '오굿 스코어 기준',
  '레벨': '오굿 스코어 기준',
  '점수올리': '오굿 스코어 기준',      // "올리려면/올리는 법" 포함 토막어
  '점수상승': '오굿 스코어 기준',
  '점수하락': '오굿 스코어 기준',
  '스코어올리': '오굿 스코어 기준',

  // ===== 연체 패널티 =====
  '연체': '연체 패널티',
  '패널티': '연체 패널티',
  '벌금': '연체 패널티',
  '연체료': '연체 패널티',
  '연체이자': '연체 패널티',
  '지연': '연체 패널티',               // "지연되면?" 같은 표현
  '미납': '연체 패널티',
  '벌점': '연체 패널티',
  '과태료': '연체 패널티',              // 흔히 혼용

  // ===== BNPL 이란? =====
  'BNPL': 'BNPL 이란?',
  'bnpl': 'BNPL 이란?',
  '분할': 'BNPL 이란?',
  '분할결제': 'BNPL 이란?',
  '분납': 'BNPL 이란?',
  '할부': 'BNPL 이란?',
  '후불': 'BNPL 이란?',
  '나중결제': 'BNPL 이란?',
  '나중에결제': 'BNPL 이란?',
  '페이후': 'BNPL 이란?',               // pay later 류 속어

  // ===== 기간 연장 =====
  '연장': '기간 연장',
  '기간': '기간 연장',
  '연기': '기간 연장',
  '유예': '기간 연장',
  '미루': '기간 연장',                  // "미루고 싶어" 등 토막어
  '기한연장': '기간 연장',
  '납부유예': '기간 연장',
  '납부일미루': '기간 연장',
  '상환유예': '기간 연장',

  // ===== 즉시 납부 플로우 =====
  '납부': '즉시 납부 플로우',
  '결제': '즉시 납부 플로우',
  '즉시납부': '즉시 납부 플로우',
  '즉시결제': '즉시 납부 플로우',
  '바로결제': '즉시 납부 플로우',
  '선결제': '즉시 납부 플로우',
  '선납': '즉시 납부 플로우',
  '즉납': '즉시 납부 플로우',
  '부분결제': '즉시 납부 플로우',        // 부분 상환을 같은 플로우로 안내
  '부분납부': '즉시 납부 플로우',
  '부분상환': '즉시 납부 플로우',

  // ===== 계정 정지 해제법 =====
  '정지': '계정 정지 해제법',
  '계정': '계정 정지 해제법',
  '해제': '계정 정지 해제법',
  '정지해제': '계정 정지 해제법',
  '잠금해제': '계정 정지 해제법',
  '락해제': '계정 정지 해제법',
  '계정잠김': '계정 정지 해제법',
  '이용제한': '계정 정지 해제법',
  '제한해제': '계정 정지 해제법',

  // ===== 포인트 =====
  '포인트': '포인트',
  '적립': '포인트',
  '리워드': '포인트',
  '적립금': '포인트',
  '캐시백': '포인트',
  '마일리지': '포인트',
  '포인트사용': '포인트',
  '포인트조회': '포인트',
  '소멸': '포인트',
  '만료': '포인트',
  '유효기간': '포인트'
};

// 기분 관련 키워드 (긍정/중립/부정 통합)
const MOOD_KEYWORDS = [
  // 긍정
  '좋다','좋아','좋은','기분좋아','기분좋다','기분이좋아','행복','행복해','행복함',
  '기쁨','기뻐','기쁘','즐거워','즐거움','신나','신남','신난','설레','설렌다','설렘',
  '뿌듯','만족','힐링','최고','대박','굿','쏘굿','괜춘','괜춘해','괜찮네','느낌좋',
  '상쾌','후련','방긋','미소','웃음','개좋','짱좋','좋당','좋넹',

  // 중립
  '그저그래','그냥그래','보통','평범','괜찮아','그냥','그럭저럭','무난','무난해',
  '애매','애매해','애매하네','나쁘지않아','나쁘지않','보통이야','보통임','중립','뉴트럴','에혀','흠','음',

  // 부정
  '안좋아','안좋','좋지않','나쁜','나쁘','우울','우울해','우울함','슬퍼','슬픈',
  '울적','속상','서운','짜증','짜증나','열받','빡치','화나','화남','홧나','분노',
  '스트레스','스트레스받아','스트레스받','불안','걱정','초조','답답','피곤','지침','지쳤',
  '현타','멘붕','번아웃','우중충','꿀꿀','찝찝','찝찝해','찜찜','허탈','불쾌','불편',
  '기분나쁨','기분안좋','눈물','울컥','암걸' // 속어 일부 포함
];

// 추천 관련 키워드
const RECOMMENDATION_KEYWORDS = [
  '추천','추천해줘','추천좀','추천부탁','추천 부탁','추천해줄래',
  '추천리스트','추천 목록','추천목록','추천상품','추천 제품','추천제품','추천아이템','추천템','템추천',
  '뭐가좋아','뭐사지','뭘사','사고싶','골라줘','골라봐','고르고싶','픽','픽해줘',
  '찾아줘','찾아봐','베스트','인기','인기템','입문템','가성비','가심비','프리미엄',
  '대체품','대안','비슷한거','비슷한제품','새로운거','다른종류','다른거','추천가능','추천 바람','추천바람','추천바래'
];

// 일반 질문 의도 키워드
const GENERAL_QUESTION_KEYWORDS = [
  '질문','궁금','물어볼','알고싶어','알고 싶어','뭐야','뭔데','뭐임','무엇',
  '어떤','어떻게','어케','어찌','어떻','어디서','언제','왜',
  '얼마','몇','며칠','몇개','조건','정책','규정','규칙','방법','방법좀','절차','가이드',
  '설명','상세','자세히','알려줘','가르쳐줘','가능','가능해','돼','되나','되나요','맞나요','맞아?',
  '문의','문의드립니다','문의요','도와줘','help','?'
];

// 처음으로 돌아가기 관련 키워드
const RESET_KEYWORDS = [
  '처음으로','처음','처음부터','처음부터다시','맨처음',
  '초기화','초기화해줘','초기화 화면','초기화면',
  '리셋','리셋해줘','reset','restart','리스타트','재시작',
  '다시','다시시작','다시 시작','다시할래','다시할게',
  '돌아가','돌아가기','처음으로 돌아가','되돌아','되돌리','되돌리기',
  '홈으로','메뉴로','메인으로',
  '새로','새로시작','새로 시작','바꿔','변경',
  '다른질문','다른 질문'
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

  // 2. 현재 플로우와의 일치성 검사 (플로우 미스매치 감지) - 우선순위 높음
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

  // 3. 구체적인 질문 키워드 체크 (정확도 높음) - 바로 답변
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
  // TODO : 이건 바뀔 수도 있음...
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
    '오굿 스코어 기준': `오굿 스코어는 
    납부 이력, 등급 점수, 제재 횟수, 결제 횟수, 가입일 등을 
    종합적으로 고려한 오굿페이만의 신용 점수야!😁`,

    '연체 패널티': `연체 시에는 계정이 정지돼서 거래를 할 수 없어!😰
    혹시 연체됐다면, 안내 메일에 적힌 절차를 따라줘!`,

    'BNPL 이란?': `부담 없이 편하게 결제할 수 있는 후불 결제 서비스야😆
    성실하게 이용하다 보면 한도가 오르는 시스템이지!`,

    '기간 연장': `15일까지 납부가 어려울 경우, 월 1회 말일까지 납부 기한을 연장해 주는 제도야!👍🏻
    하지만 연체되지 않도록 꼭 주의하라구~`,

    '즉시 납부 플로우': `사용한 금액에 대해 즉시 납부가 가능해! 즉시 납부한 만큼 추가 사용도 가능하다는 점~😆`,

    '포인트': `등급에 따라 일정 금액이 적립되는 시스템이야! 출석 체크를 통해서도 모을 수 있어😉
    열심히 모으면 꽤 큰 금액을 모을 수 있지!`
  };

  return answers[questionType] || '미안ㅠㅠ 질문을 이해하지 못했어!! 다시 얘기해줄래?😭';
};