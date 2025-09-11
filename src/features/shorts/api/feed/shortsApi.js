// api 서비스 함수 정의
import axiosInstance from "../../../../shared/api/axiosInstance";

const shortsApi = {
  // 피드 조회 api
  getFeeds: async (params) => {
    try {
      const response = await axiosInstance.get("/api/shorts/feeds", { params });
      return response.data.data;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },

  // 댓글 조회 api
  getComments: async (shortsId) => {
    try {
      const response = await axiosInstance.get(
        `/shorts/feeds/${shortsId}/comments`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },
};

export default shortsApi;
