/* 사용하지 않는 파일 */
// // ApiClient (axios로 감싸는 버전 권장)
// import axiosInstance from "./axiosInstance";

// export default class ApiClient {
//   constructor(baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api") {
//     this.baseURL = baseURL.replace(/\/+$/, "");
//   }

//   buildURL(endpoint, params) {
//     const url = `${this.baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
//     if (!params) return url;
//     const qs = new URLSearchParams(params);
//     return `${url}?${qs.toString()}`;
//   }

//   async request(endpoint, { method = "GET", params, body, headers, timeout = 15000 } = {}) {
//     const url = this.buildURL(endpoint, params);
//     const cfg = {
//       url,
//       method,
//       headers: { "Content-Type": "application/json", ...headers },
//       timeout,
//       data: body == null || method === "GET" ? undefined : body,
//       // ➜ 토큰, 리프레시, 401 재시도는 axiosInstance 인터셉터가 처리
//     };
//     const res = await axiosInstance.request(cfg);

//     // 공통 unwrap
//     const data = res?.data;
//     if (data && typeof data === "object" && "success" in data) {
//       if (!data.success) throw new Error(data.message || "요청 실패");
//       return data.data ?? {};
//     }
//     return data ?? {};
//   }

//   // SSE 필요하면 그대로 유지
//   createSSE(endpoint, params) {
//     const url = this.buildURL(endpoint, params);
//     return new EventSource(url);
//   }
// }
