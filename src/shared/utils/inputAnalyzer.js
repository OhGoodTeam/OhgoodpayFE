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
  '기분나쁨','기분안좋','눈물','울컥','암걸', '구려' // 속어 일부 포함
];

// 추천 관련 키워드
const RECOMMENDATION_KEYWORDS = [
  '추천','추천해줘','추천좀','추천부탁','추천 부탁','추천해줄래',
  '추천리스트','추천 목록','추천목록','추천상품','추천 제품','추천제품','추천아이템','추천템','템추천',
  '뭐가좋아','뭐사지','뭘사','사고싶','사고 싶','골라줘','골라봐','고르고싶','고르고 싶','픽','픽해줘',
  '찾아줘','찾아봐','베스트','인기','인기템','입문템','가성비','가심비','프리미엄',
  '대체품','대안','비슷한거','비슷한제품','새로운거','다른종류','다른거','추천가능','추천 바람','추천바람','추천바래',
  '뭐 좋을까?', '뭐좋을까?', '어떤 게 좋아?', '어떤게 좋아?', '어떤게좋아?', '선택해줘', '뭘 살까?', '뭘살까?', '살까', '뭐가 괜찮을까?',
  '뭐가 괜찮을까?', '뭐가괜찮을까?', '뭐가 괜찮을까','사고싶음','사고 싶음','뭐 삼?','뭐삼?','뭐 살까?','뭐살까?', '쓰고 싶','쓸꺼임','털어야지','추천해조','살까','살까요'
];

// 일반 질문 의도 키워드
const GENERAL_QUESTION_KEYWORDS = [
  '질문','궁금','물어볼','알고싶어','알고 싶어','뭐야','뭔데','뭐임','무엇',
  '어떤','어떻게','어케','어찌','어떻','어디서','언제','왜',
  '얼마','몇','며칠','몇개','조건','정책','규정','규칙','방법','방법좀','절차','가이드',
  '설명','상세','자세히','알려줘','가르쳐줘','가능','가능해','돼','되나','되나요','맞나요','맞아?',
  '문의','문의드립니다','문의요','도와줘','help'
];

// 처음으로 돌아가기 관련 키워드 - 제거됨 (토글로만 처리)

// 퀵메뉴 키워드 매핑 (자연어 → 메뉴 타입)
const QUICKMENU_KEYWORDS = {
  // ===== 납부 관련 =====
  '납부': 'payment',
  '납부하기': 'payment',
  '결제하기': 'payment',
  '돈내기': 'payment',
  '돈 내기': 'payment',
  '납부어디': 'payment',
  '납부 어디': 'payment',
  '결제어디': 'payment',
  '결제 어디': 'payment',
  '어디서납부': 'payment',
  '어디서 납부': 'payment',
  '어디서결제': 'payment',
  '어디서 결제': 'payment',
  '납부하려면': 'payment',
  '결제하려면': 'payment',
  '돈내려면': 'payment',
  '돈 내려면': 'payment',

  // ===== 결제 내역 =====
  // ===== 결제 내역 =====
  '결제내역': 'payment-history',
  '결제 내역': 'payment-history',
  '결제': 'payment-history',
  '지불': 'payment-history',
  '거래내역': 'payment-history',
  '거래 내역': 'payment-history',
  '사용내역': 'payment-history',
  '사용 내역': 'payment-history',
  '결제내역어디': 'payment-history',
  '결제 내역 어디': 'payment-history',
  '구매내역': 'payment-history',
  '구매 내역': 'payment-history',
  '구매기록': 'payment-history',
  '구매 기록': 'payment-history',
  '결제기록': 'payment-history',
  '결제 기록': 'payment-history',
  '결제리스트': 'payment-history',
  '결제 리스트': 'payment-history',
  '거래기록': 'payment-history',
  '거래 기록': 'payment-history',
  '주문내역': 'payment-history',
  '주문 내역': 'payment-history',
  '주문기록': 'payment-history',
  '주문 기록': 'payment-history',
  '결제확인': 'payment-history',
  '결제 확인': 'payment-history',
  '구매확인': 'payment-history',
  '구매 확인': 'payment-history',
  '결제조회': 'payment-history',
  '결제 조회': 'payment-history',
  '거래조회': 'payment-history',
  '거래 조회': 'payment-history',
  '결제현황': 'payment-history',
  '결제 현황': 'payment-history',
  '결제목록': 'payment-history',
  '결제 목록': 'payment-history',
  '구매목록': 'payment-history',
  '구매 목록': 'payment-history',
  '결제이력': 'payment-history',
  '결제 이력': 'payment-history',
  '구매이력': 'payment-history',
  '구매 이력': 'payment-history',
  '거래이력': 'payment-history',
  '거래 이력': 'payment-history',
  '지불기록': 'payment-history',
  '지불 기록': 'payment-history',
  '지불내역': 'payment-history',
  '지불 내역': 'payment-history',
  '지불이력': 'payment-history',
  '지불 이력': 'payment-history',
  '페이먼트': 'payment-history',
  '페이먼트내역': 'payment-history',
  '페이먼트 내역': 'payment-history',
  '구입내역': 'payment-history',
  '구입 내역': 'payment-history',
  '구입기록': 'payment-history',
  '구입 기록': 'payment-history',

  // ===== 오굿 리포트 =====
  '리포트': 'dashboard',
  '오굿리포트': 'dashboard',
  '오굿 리포트': 'dashboard',
  '대시보드': 'dashboard',
  '현황': 'dashboard',
  '분석': 'dashboard',
  '리포트어디': 'dashboard',
  '리포트 어디': 'dashboard',
  '대시보드어디': 'dashboard',
  '대시보드 어디': 'dashboard',
  '현황어디': 'dashboard',
  '현황 어디': 'dashboard',
  '상태확인': 'dashboard',
  '상태 확인': 'dashboard',
  '나의현황': 'dashboard',
  '나의 현황': 'dashboard',
  '내현황': 'dashboard',
  '내 현황': 'dashboard',

  // ===== 포인트 내역 =====
  '포인트내역': 'point-history',
  '포인트 내역': 'point-history',
  '포인트': 'point-history',
  '적립금': 'point-history',
  '마일리지': 'point-history',
  '포인트어디': 'point-history',
  '포인트 어디': 'point-history',
  '적립금어디': 'point-history',
  '적립금 어디': 'point-history',
  '포인트확인': 'point-history',
  '포인트 확인': 'point-history',
  '포인트조회': 'point-history',
  '포인트 조회': 'point-history',
  '내포인트': 'point-history',
  '내 포인트': 'point-history',

  // ===== 출석 체크 =====
  '출석': 'checkin',
  '출석체크': 'checkin',
  '출석 체크': 'checkin',
  '출첵': 'checkin',
  '체크인': 'checkin',
  '출석어디': 'checkin',
  '출석 어디': 'checkin',
  '출석체크어디': 'checkin',
  '출석 체크 어디': 'checkin',
  '체크인어디': 'checkin',
  '체크인 어디': 'checkin',
  '출석하기': 'checkin',
  '출석 하기': 'checkin',
  '출석하러': 'checkin',
  '출석 하러': 'checkin',
  '출석할래': 'checkin',
  '출석 할래': 'checkin',
  '출석하고싶어': 'checkin',
  '출석 하고싶어': 'checkin',
  '출석하고 싶어': 'checkin',
  '출석이벤트': 'checkin',
  '출석 이벤트': 'checkin',
  '출석보상': 'checkin',
  '출석 보상': 'checkin',
  '출석혜택': 'checkin',
  '출석 혜택': 'checkin',
  '출석포인트': 'checkin',
  '출석 포인트': 'checkin',
  '데일리체크': 'checkin',
  '데일리 체크': 'checkin',
  '일일출석': 'checkin',
  '일일 출석': 'checkin',
  '매일출석': 'checkin',
  '매일 출석': 'checkin',
  '오늘출석': 'checkin',
  '오늘 출석': 'checkin',
  '출석확인': 'checkin',
  '출석 확인': 'checkin',
  '출석도장': 'checkin',
  '출석 도장': 'checkin',
  '출석스탬프': 'checkin',
  '출석 스탬프': 'checkin',
  '출석찍기': 'checkin',
  '출석 찍기': 'checkin',
  '출석찍으러': 'checkin',
  '출석 찍으러': 'checkin',
  '출석완료': 'checkin',
  '출석 완료': 'checkin',
  '출석현황': 'checkin',
  '출석 현황': 'checkin',
  '출석내역': 'checkin',
  '출석 내역': 'checkin',
  '출석기록': 'checkin',
  '출석 기록': 'checkin',
  '출석조회': 'checkin',
  '출석 조회': 'checkin',
  '출석페이지': 'checkin',
  '출석 페이지': 'checkin',
  '출석어디서': 'checkin',
  '출석 어디서': 'checkin',
  '출석어떻게': 'checkin',
  '출석 어떻게': 'checkin',
  '체크인하기': 'checkin',
  '체크인 하기': 'checkin',
  '체크인하러': 'checkin',
  '체크인 하러': 'checkin',
  '체크인이벤트': 'checkin',
  '체크인 이벤트': 'checkin',
  'daily체크': 'checkin',
  'daily 체크': 'checkin',
  '데일리출석': 'checkin',
  '데일리 출석': 'checkin',
  '출석부': 'checkin',
  '출석 부': 'checkin',
  'attendance': 'checkin',
  'check-in': 'checkin',
  'checkin': 'checkin',
};

// 퀵메뉴 정보 매핑
const QUICKMENU_INFO = {
  payment: {
    title: '납부',
    description: '결제 대금 납부하기',
    route: '/payment',
    icon: 'payment'
  },
  'payment-history': {
    title: '결제 내역',
    description: '결제 내역 확인하기',
    route: '/payment/details',
    icon: 'paymentHistory'
  },
  dashboard: {
    title: '오굿 리포트',
    description: '나의 리포트 확인하기',
    route: '/dashboard',
    icon: 'dashboard'
  },
  'point-history': {
    title: '포인트 내역',
    description: '나의 포인트 내역 확인하기',
    route: '/point/history',
    icon: 'point'
  },
  checkin: {
    title: '출석 체크',
    description: '출석 체크하고 포인트 적립하기',
    action: 'checkin',
    icon: 'checkin'
  }
};

// 토글 옵션 키워드 매핑 (정확한 매치)
const TOGGLE_KEYWORDS = {
  // ===== INIT 플로우 토글 =====
  '기분에 따른 추천': 'mood_recommendation',
  '자주하는 질문': 'frequent_questions',

  // ===== QUESTION 플로우 토글 =====
  '오굿 스코어 기준': 'ohgood_score_criteria',
  '연체 패널티': 'overdue_penalty',
  'BNPL 이란?': 'what_is_bnpl',
  '기간 연장': 'period_extension',
  '즉시 납부 플로우': 'immediate_payment_flow',
  '포인트': 'point',

  // ===== MOODCHECK 플로우 토글 =====
  '좋아': 'good_mood',
  '그저그래': 'so_so_mood',
  '안좋아': 'bad_mood',

  // ===== HOBBYCHECK 플로우 토글 =====
  '게임': 'gaming',
  '독서': 'reading',
  '음악감상': 'music',
  '운동': 'exercise',
  '영화보기': 'movies',

  // ===== CHOOSE 플로우 토글 =====
  '상품추천': 'product_recommendation',
  '내 리포트 보기': 'my_report',

  // ===== RECOMMENDATION & RE_RECOMMENDATION 플로우 토글 =====
  '다른 상품': 'other_products',

  // ===== 공통 토글 =====
  '처음으로': 'reset',
  '현재 플로우 유지하기': 'keep_current_flow'
};

/**
 * 사용자 입력을 분석하여 플로우 타입을 결정
 * @param {string} input - 사용자 입력 텍스트
 * @param {string} currentFlow - 현재 채팅 플로우
 * @returns {object} - { flowType, matchedKeyword, confidence, isDirectAnswer }
 */
export const analyzeUserInput = (input, currentFlow = null) => {
  const normalizedInput = input.toLowerCase().trim();
  console.log('=== analyzeUserInput 시작 ===');
  console.log('입력:', input, '초기플로우:', currentFlow);

  // 1. 토글 키워드 정확 매치 체크 (최우선 - 토글에서 입력된 텍스트)
  for (const [toggleText, toggleType] of Object.entries(TOGGLE_KEYWORDS)) {
    if (input.trim() === toggleText) {
      console.log('토글 키워드 정확 매치:', toggleText, '->', toggleType);

      // 토글 타입에 따른 기존 플로우로 매핑
      if (toggleType === 'reset') {
        return {
          flowType: 'reset',
          matchedKeyword: toggleText,
          confidence: 'high',
          isDirectAnswer: true
        };
      }

      if (toggleType === 'keep_current_flow') {
        return {
          flowType: 'keep_current_flow',
          matchedKeyword: toggleText,
          confidence: 'high',
          isDirectAnswer: true
        };
      }

      if (toggleType === 'frequent_questions') {
        return {
          flowType: 'question',
          matchedKeyword: toggleText,
          confidence: 'high',
          isDirectAnswer: false // 질문 선택 토글 보여주기
        };
      }

      if (toggleType === 'mood_recommendation') {
        return {
          flowType: 'start',
          matchedKeyword: toggleText,
          confidence: 'high',
          isDirectAnswer: false
        };
      }

      // 질문 플로우의 토글들 (바로 답변) - 기존 질문 키워드로 처리
      if (['ohgood_score_criteria', 'overdue_penalty', 'what_is_bnpl', 'period_extension', 'immediate_payment_flow', 'point'].includes(toggleType)) {
        const questionKeywordMap = {
          'ohgood_score_criteria': '오굿 스코어 기준',
          'overdue_penalty': '연체 패널티',
          'what_is_bnpl': 'BNPL 이란?',
          'period_extension': '기간 연장',
          'immediate_payment_flow': '즉시 납부 플로우',
          'point': '포인트'
        };

        return {
          flowType: 'question',
          matchedKeyword: questionKeywordMap[toggleType],
          confidence: 'high',
          isDirectAnswer: true // 바로 답변
        };
      }

      // 기분 관련 토글들 - 직접 기분 키워드로 처리 (재귀 호출 방지)
      if (['good_mood', 'so_so_mood', 'bad_mood'].includes(toggleType)) {
        const moodKeywordMap = {
          'good_mood': '좋아',
          'so_so_mood': '그저그래',
          'bad_mood': '안좋아'
        };

        // currentFlow가 있으면 그대로 유지해서 API 호출
        return {
          flowType: currentFlow || 'start',
          matchedKeyword: moodKeywordMap[toggleType],
          confidence: 'high',
          isDirectAnswer: false
        };
      }

      // 취미 관련 토글들 - 일반 텍스트로 처리 (API 호출)
      if (['gaming', 'reading', 'music', 'exercise', 'movies'].includes(toggleType)) {
        // currentFlow가 있으면 그대로 유지해서 API 호출
        return {
          flowType: currentFlow || 'start',
          matchedKeyword: null,
          confidence: 'medium',
          isDirectAnswer: false
        };
      }

      // 상품 관련 토글들 - 일반 텍스트로 처리 (API 호출)
      if (['product_recommendation', 'other_products'].includes(toggleType)) {
        return {
          flowType: currentFlow || 'start',
          matchedKeyword: null,
          confidence: 'medium',
          isDirectAnswer: false
        };
      }

      // 내 리포트 보기 - 대시보드 퀵메뉴로 처리
      if (toggleType === 'my_report') {
        return {
          flowType: 'quickmenu',
          matchedKeyword: '대시보드',
          menuType: 'dashboard',
          menuInfo: QUICKMENU_INFO['dashboard'],
          confidence: 'high',
          isDirectAnswer: true
        };
      }
    }
  }

  // 2. 퀵메뉴 키워드 체크 (두번째 우선순위)
  for (const [keyword, menuType] of Object.entries(QUICKMENU_KEYWORDS)) {
    if (normalizedInput.includes(keyword.toLowerCase())) {
      return {
        flowType: 'quickmenu',
        matchedKeyword: keyword,
        menuType: menuType,
        menuInfo: QUICKMENU_INFO[menuType],
        confidence: 'high',
        isDirectAnswer: true
      };
    }
  }

  // 3. 리셋/처음으로 키워드 체크 제거됨 (토글로만 처리)

  // 4. 현재 플로우와의 일치성 검사 (플로우 미스매치 감지) - 우선순위 높음
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

  // 5. 구체적인 질문 키워드 체크 (정확도 높음) - 바로 답변하되 질문 플로우로 설정
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

  // 6. 일반 질문 의도 감지 - 질문 플로우로 안내
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

  // 7. 기분 키워드 체크
  const moodMatch = MOOD_KEYWORDS.find(keyword =>
    normalizedInput.includes(keyword)
  );
  if (moodMatch && currentFlow === 'init') {
    return {
      flowType: 'start',
      matchedKeyword: moodMatch,
      confidence: 'high',
      isDirectAnswer: false
    };
  }

  // 8. 추천 키워드 체크
  const recommendMatch = RECOMMENDATION_KEYWORDS.find(keyword =>
    normalizedInput.includes(keyword)
  );
  if (recommendMatch && currentFlow === 'init') {
    return {
      flowType: 'start', // 추천 요청도 기분 체크부터 시작
      matchedKeyword: recommendMatch,
      confidence: 'medium',
      isDirectAnswer: false
    };
  }

  // 9. 기본값: 현재 플로우에 따른 처리
  if (currentFlow && currentFlow !== 'init') {
    // 현재 플로우가 있으면 그대로 유지해서 유효성 검증으로 넘김
    return {
      flowType: currentFlow,
      matchedKeyword: null,
      confidence: 'low',
      isDirectAnswer: false
    };
  }

  // 기타 기본값 처리
  if (normalizedInput.includes('?') || normalizedInput.includes('？')) {
    return {
      flowType: 'question',
      matchedKeyword: null,
      confidence: 'medium',
      isDirectAnswer: false
    };
  }

  if (normalizedInput.length < 10) {
    return {
      flowType: 'start',
      matchedKeyword: null,
      confidence: 'low',
      isDirectAnswer: false
    };
  } else {
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