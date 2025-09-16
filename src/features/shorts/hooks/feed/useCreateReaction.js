import { useCallback } from "react";
import shortsApi from "../../api/feed/shortsApi";

export function useCreateReaction() {
  const createReaction = useCallback(async (shortsId, params) => {
    try {
      const response = await shortsApi.createReaction(shortsId, params);

      if (response.success) {
        return response.data.data;
      } else {
        throw new Error(response.error || "API 호출 실패");
      }
    } catch (error) {
      console.error("반응 생성 실패:", error);
      throw error;
    }
  }, []);

  return { createReaction };
}
