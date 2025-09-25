// 채팅 플로우 타입 정의 (백엔드 Enum과 동일)

export const FLOW_TYPES = {
  MOODCHECK: 'mood_check',
  HOBBYCHECK: 'hobby_check',
  CHOOSE: 'choose',
  RECOMMENDATION: 'recommendation',
  RE_RECOMMENDATION: 're-recommendation'
};

// 플로우 표시명 매핑
export const FLOW_DISPLAY_NAMES = {
  [FLOW_TYPES.MOODCHECK]: '기분 체크',
  [FLOW_TYPES.HOBBYCHECK]: '취미 체크',
  [FLOW_TYPES.CHOOSE]: '선택',
  [FLOW_TYPES.RECOMMENDATION]: '추천',
  [FLOW_TYPES.RE_RECOMMENDATION]: '재추천'
};

// 플로우별 토글 옵션 정의
export const FLOW_TOGGLE_OPTIONS = {
  [FLOW_TYPES.MOODCHECK]: ['좋아', '그저그래', '안좋아'],
  [FLOW_TYPES.HOBBYCHECK]: ['게임', '독서', '음악감상', '운동', '영화보기'],
  [FLOW_TYPES.CHOOSE]: ['상품추천', '내 리포트 보기'],
  [FLOW_TYPES.RECOMMENDATION]: ['다른 상품'],
  [FLOW_TYPES.RE_RECOMMENDATION]: ['다른 상품']
  // [FLOW_TYPES.RECOMMENDATION]: ['좋아요','다른 상품'],
  // [FLOW_TYPES.RE_RECOMMENDATION]: ['좋아요','다른 상품']
};

// flow에 따른 토글 옵션 가져오기
export const getToggleOptionsByFlow = (flow) => {
  return FLOW_TOGGLE_OPTIONS[flow] || ['상품추천', '내 리포트 보기', '기타'];
};