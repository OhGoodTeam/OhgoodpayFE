// api 서비스 함수 정의
import axiosInstance from "../../../../shared/api/axiosInstance";

const shortsApi = {
  // 피드 조회 api
  getFeeds: async (params) => {
    try {
      const response = await axiosInstance.get("/shorts/feeds", { params });
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

  // 댓글 작성 api
  createComment: async (shortsId, params) => {
    try {
      const response = await axiosInstance.post(
        `/shorts/feeds/${shortsId}/comments`,
        params
      );
      console.log("createComment: async (shortsId, params) => {", response);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error", error);
      throw {
        success: false,
        error: error,
      };
    }
  },

  // 좋아요, 싫어요 api
  createReaction: async (shortsId, params) => {
    try {
      const response = await axiosInstance.post(
        `/shorts/feeds/${shortsId}/reactions`,
        params
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error", error);
      return {
        success: false,
        error: error,
      };
    }
  },
};

export default shortsApi;
