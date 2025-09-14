// 채팅 초기화 유틸리티

import { FLOW_TYPES } from '../constants/flowTypes.js';
import { formatMessageForAPI } from './messageUtils.js';
import chatApi from '../api/chatApi.js';

// 채팅 세션 초기화 (첫 접속시 빈 메시지로 mood_check 플로우 시작)
export const initializeChatSession = async (customerId = 1, sessionId) => {
  try {
    const initialRequest = formatMessageForAPI("", FLOW_TYPES.MOODCHECK, customerId, sessionId);
    const response = await chatApi.sendChatMessage(initialRequest);
    return response;
  } catch (error) {
    console.error('채팅 세션 초기화 실패:', error);
    throw error;
  }
};