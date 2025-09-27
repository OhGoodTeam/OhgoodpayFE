// 채팅 플로우 타입 정의 (백엔드 Enum과 동일)

export const FLOW_TYPES = {
  INIT: 'init',
  START: 'start',
  QUESTION: 'question', // 프론트 단에서 처리하는 플로우
  FLOW_MISMATCH: 'flow_mismatch', // 플로우 미스매치 선택
  MOODCHECK: 'mood_check',
  HOBBYCHECK: 'hobby_check',
  CHOOSE: 'choose',
  RECOMMENDATION: 'recommendation',
  RE_RECOMMENDATION: 're-recommendation'
};

// 플로우 표시명 매핑
export const FLOW_DISPLAY_NAMES = {
  [FLOW_TYPES.INIT]: '초기화',
  [FLOW_TYPES.START]: '시작',
  [FLOW_TYPES.QUESTION]: '질문',
  [FLOW_TYPES.FLOW_MISMATCH]: '플로우 선택',
  [FLOW_TYPES.MOODCHECK]: '기분 체크',
  [FLOW_TYPES.HOBBYCHECK]: '취미 체크',
  [FLOW_TYPES.CHOOSE]: '선택',
  [FLOW_TYPES.RECOMMENDATION]: '추천',
  [FLOW_TYPES.RE_RECOMMENDATION]: '재추천'
};

// 플로우별 토글 옵션 정의
export const FLOW_TOGGLE_OPTIONS = {
  [FLOW_TYPES.INIT]: ['기분에 따른 추천', '자주하는 질문'], //INIT 플로우 변경에 따른 토글 변경
  [FLOW_TYPES.QUESTION]: ['오굿 스코어 기준', '연체 패널티', 'BNPL 이란?', '기간 연장', '즉시 납부 플로우', '포인트'], //자주하는 질문에 대한 토글
  [FLOW_TYPES.FLOW_MISMATCH]: ['처음으로', '현재 플로우 유지하기'], // 플로우 미스매치 선택
  [FLOW_TYPES.MOODCHECK]: ['좋아', '그저그래', '안좋아'],
  [FLOW_TYPES.HOBBYCHECK]: ['게임', '독서', '음악감상', '운동', '영화보기'],
  [FLOW_TYPES.CHOOSE]: ['상품추천', '내 리포트 보기'],
  [FLOW_TYPES.RECOMMENDATION]: ['다른 상품'],
  [FLOW_TYPES.RE_RECOMMENDATION]: ['다른 상품']
};

// flow에 따른 토글 옵션 가져오기
export const getToggleOptionsByFlow = (flow) => {
  return FLOW_TOGGLE_OPTIONS[flow] || ['기분에 따른 추천', '자주하는 질문']
};