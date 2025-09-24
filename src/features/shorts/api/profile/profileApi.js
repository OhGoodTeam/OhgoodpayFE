import axiosInstance from "../../../../shared/api/axiosInstance";

const profileApi = {
  // 프로필 조회 api
  getProfile: async (params) => {
    try {
      const response = await axiosInstance.get("/api/shorts/profile", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },

  // 구독하기 api
  createSubscription: async (params) => {
    try {
      const response = await axiosInstance.post(
        `/api/shorts/subscribe/${params.targetId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  },
};

export default profileApi;
