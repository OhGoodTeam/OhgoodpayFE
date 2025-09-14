// 채팅 플로우 타입 정의 (백엔드 Enum과 동일)

export const FLOW_TYPES = {
  MOODCHECK: 'mood_check',
  HOBBYCHECK: 'hobby_check',
  CHOOSE: 'choose',
  RECOMMENDATION: 'recommendation',
  RE_RECOMMENDATION: 're-recommendation'
};

// 플로우 순서 정의
export const FLOW_SEQUENCE = [
  FLOW_TYPES.MOODCHECK,
  FLOW_TYPES.HOBBYCHECK,
  FLOW_TYPES.CHOOSE,
  FLOW_TYPES.RECOMMENDATION,
  FLOW_TYPES.RE_RECOMMENDATION
];

// 다음 플로우 가져오기
export const getNextFlow = (currentFlow) => {
  const currentIndex = FLOW_SEQUENCE.indexOf(currentFlow);
  if (currentIndex === -1 || currentIndex === FLOW_SEQUENCE.length - 1) {
    return currentFlow; // 마지막 플로우이거나 찾을 수 없으면 현재 플로우 유지
  }
  return FLOW_SEQUENCE[currentIndex + 1];
};

// 플로우 표시명 매핑
export const FLOW_DISPLAY_NAMES = {
  [FLOW_TYPES.MOODCHECK]: '기분 체크',
  [FLOW_TYPES.HOBBYCHECK]: '취미 체크',
  [FLOW_TYPES.CHOOSE]: '선택',
  [FLOW_TYPES.RECOMMENDATION]: '추천',
  [FLOW_TYPES.RE_RECOMMENDATION]: '재추천'
};