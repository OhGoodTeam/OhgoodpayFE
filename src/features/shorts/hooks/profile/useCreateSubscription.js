import profileApi from "../../api/profile/profileApi";

export function useCreateSubscription() {
  const createSubscription = async (params) => {
    try {
      const response = await profileApi.createSubscription(params);
      return response;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  };
  return { createSubscription };
}
