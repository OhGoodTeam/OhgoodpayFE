// 공통 API 클라이언트 (fetch 기반)
/* 
* 공통 로직, 서버에서 반환하는 respons중에서 data만 반환하도록 여기서 한번에 처리
* 중복 제거(DRY) + 일관성 + 확장성
*/
const DEFAULT_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';
const DEBUG = import.meta.env.DEV; // 개발 모드에서만 로그

export default class ApiClient {
  constructor(baseURL = DEFAULT_BASE_URL) {
    this.baseURL = baseURL.replace(/\/+$/, ''); // 끝 슬래시 제거
  }

  buildURL(endpoint, params) {
    const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    if (!params) return url;
    const qs = new URLSearchParams(params);
    return `${url}?${qs.toString()}`;
  }

  async request(endpoint, { method = 'GET', params, body, headers, timeout = 15000 } = {}) {
    const url = this.buildURL(endpoint, params);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    };
    if (body != null && method !== 'GET') {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    if (DEBUG) {
      console.log('🔥 API 요청', { url, method, params, body });
    }

    try {
      const res = await fetch(url, config);

      if (DEBUG) {
        console.log('📡 API 응답', { status: res.status, url: res.url });
      }

      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const payload = isJson ? await res.json() : await res.text();

      // HTTP 에러
      if (!res.ok) {
        const msg = isJson ? (payload?.message || JSON.stringify(payload)) : String(payload);
        const err = new Error(msg || `HTTP ${res.status}`);
        err.status = res.status;
        err.payload = payload;
        throw err;
      }

      // ApiResponseWrapper 언래핑 (success/code/message/data)
      if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
        if (payload.success) return payload.data;
        const err = new Error(payload.message || 'Request failed');
        err.code = payload.code;
        throw err;
      }

      // 그 외 엔드포인트(래핑 안 된 경우)
      return payload;
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error('요청이 시간 초과되었습니다.');
      }
      if (DEBUG) console.error('API request failed:', e);
      throw e;
    } finally {
      clearTimeout(id);
    }
  }

  // 브라우저 기본 EventSource: 헤더 커스터마이즈 불가 → 필요한 값은 쿼리스트링으로
  createSSE(endpoint, params) {
    const url = this.buildURL(endpoint, params);
    if (DEBUG) console.log('🔌 SSE 연결', { url });
    return new EventSource(url);
  }
}
