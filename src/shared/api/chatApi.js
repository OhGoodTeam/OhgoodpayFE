import axios from 'axios';
import  callToken from "../hook/callToken";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 자동 추가
axiosInstance.interceptors.request.use(
    async (config) => {
      console.log("API 요청:", {
        url: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        data: config.data,
      });

      // public API나 auth 관련 API는 토큰 없이 요청
      if (config.url.includes("/api/public") || config.url.includes("/auth")) {
        return config;
      }

      try {
        const token = await callToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("토큰이 없습니다. 서버에서 인증을 확인합니다.");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(new Error("토큰이 없습니다"));
        }
      } catch (error) {
        console.error("토큰 처리 중 오류 발생:", error);
        return Promise.reject(error);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리 및 로깅
axiosInstance.interceptors.response.use(
    (response) => {
      console.log("API 응답:", {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
      });
      console.log("응답 데이터:", response.data);

      return response;
    },
    (error) => {
      // 응답 오류 처리
      if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
      ) {
        console.error("인증 오류: 토큰이 유효하지 않거나 만료되었습니다.");
        sessionStorage.removeItem("accessToken");

        // 현재 페이지가 로그인 페이지가 아닐 때만 리디렉션
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      console.error("API request failed:", error);
      return Promise.reject(error);
    }
);

class ChatApiService {
  constructor() {
    this.axiosInstance = axiosInstance;
  }

  // HTTP 요청을 위한 기본 메서드 (기존 호환성 유지)
  async request(endpoint, options = {}) {
    const config = {
      url: endpoint,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: {
        ...options.headers,
      },
      ...options,
    };

    // body는 axios에서 data로 사용하므로 제거
    delete config.body;

    const response = await this.axiosInstance.request(config);
    return response.data;
  }

  // 채팅 메시지 전송 API (axios 방식으로 단순화)
  async sendChatMessage(messageData) {
    const response = await this.axiosInstance.post("/chat", messageData);
    return response.data;
  }

  // 세션 초기화 API
  async clearSession(sessionId) {
    const response = await this.axiosInstance.post("/chat/clear-session", { sessionId });
    return response.data;
  }

  // 추가: 직접적인 axios 메서드들
  async get(endpoint, config = {}) {
    const response = await this.axiosInstance.get(endpoint, config);
    return response.data;
  }

  async post(endpoint, data, config = {}) {
    const response = await this.axiosInstance.post(endpoint, data, config);
    return response.data;
  }

  async put(endpoint, data, config = {}) {
    const response = await this.axiosInstance.put(endpoint, data, config);
    return response.data;
  }

  async delete(endpoint, config = {}) {
    const response = await this.axiosInstance.delete(endpoint, config);
    return response.data;
  }
}

// 싱글톤 인스턴스 생성
const chatApi = new ChatApiService();

export default chatApi;
