import { useCallback } from "react";
import axiosInstance from "../../../../shared/api/axiosInstance";

// 구독, 구독취소
export const useSubscription = () => {
  const unsubscribe = useCallback(
    async (targetId, onSuccess) => {
      try {
        console.log("구독 취소 요청:", { targetId });
        const response = await axiosInstance.delete(
          "/api/shorts/mypage/subscription",
          {
            params: { targetId },
          }
        );

        if (response.status === 200) {
          console.log("구독 취소 성공");
          if (onSuccess) {
            onSuccess(targetId);
          }
          alert("구독이 취소되었습니다.");
          return true;
        }
      } catch (err) {
        console.error("구독 취소 실패:", err);
        alert("구독 취소에 실패했습니다.");
        return false;
      }
    },
    []
  );

  return {
    unsubscribe,
  };
};

export default useSubscription;
