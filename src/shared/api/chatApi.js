// 채팅 API 서비스
import callToken from "../hook/callToken";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

class ChatApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // HTTP 요청을 위한 기본 fetch 설정
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    console.log("🔥 API 요청:", {
      url: url,
      method: options.method || "GET",
      body: options.body,
    });

    const token = await callToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      console.log("📡 API 응답:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("응답 데이터:", result);

      return result;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // 채팅 메시지 전송 API (모든 요청을 /chat 하나로 처리)
  async sendChatMessage(messageData) {
    return this.request("/chat", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  // SSE 연결을 위한 EventSource 생성
  createSSEConnection(endpoint = "/chat/stream", options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    return new EventSource(url, options);
  }
}

// 싱글톤 인스턴스 생성
const chatApi = new ChatApiService();

export default chatApi;
