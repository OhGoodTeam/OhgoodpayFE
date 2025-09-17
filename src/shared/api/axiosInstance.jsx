import axios from "axios";
import callToken from "./callToken";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 응답 오류 처리
    if(error.response && error.response.status === 401){
      console.error("인증 오류: 토큰이 유효하지 않거나 만료되었습니다.");
      sessionStorage.removeItem("accessToken"); // 토큰 제거
      window.location.href = "/login"; // 로그인 페이지로 리디렉션
    }
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.request.use(
  async (config) => {
    try{
      const token = await callToken();

      if(token){
        config.headers.Authorization = `Bearer ${token}`;
      }else{
        console.error("토큰을 가져올 수 없습니다.");
      }
    }catch(error){
      console.error("토큰 처리 중 오류 발생:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
