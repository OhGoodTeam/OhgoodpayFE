// api 서비스 함수 정의
import axiosInstance from "../../../../shared/api/axiosInstance";

const shortsApi = {
  // 피드 조회 api
  getFeeds: async (params) => {
    try {
      const response = await axiosInstance.get("/api/public/shorts/feeds", {
        params,
      });
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
        `/api/public/shorts/feeds/${shortsId}/comments`
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
        `/api/shorts/feeds/${shortsId}/comments`,
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
        `/api/shorts/feeds/${shortsId}/reactions`,
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

  // 댓글 삭제
  deleteComment: async (shortsId, commentId, params) => {
    try {
      const response = await axiosInstance.delete(
        `/api/shorts/feeds/${shortsId}/comments/${commentId}/delete`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },
};

export default shortsApi;
