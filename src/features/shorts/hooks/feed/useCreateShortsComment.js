import React, { useState } from "react";
import shortsApi from "../../api/feed/shortsApi";

export function useCreateShortsComment() {
  // 댓글 데이터
  const [data, setData] = useState(null);
  // 에러 state
  const [error, setError] = useState(null);
  // 로딩 state
  const [loading, setLoading] = useState(true);

  const createComment = async (shortsId, params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await shortsApi.createComment(shortsId, params);
      console.log("API 응답:", response);

      // API가 true만 반환하는 경우 처리
      if (response === true) {
        console.log("API가 true만 반환함. 댓글 목록을 다시 조회합니다.");
        const commentsResponse = await shortsApi.getComments(shortsId);
        const comments = commentsResponse.data.data;
        const latestComment = comments[0]; // 가장 최신 댓글 (첫 번째)
        console.log("최신 댓글:", latestComment);

        setData(latestComment);
        return {
          success: true,
          data: latestComment,
        };
      }

      // 기존 응답 구조 처리
      if (response.success) {
        setData(response.data);
        console.log("댓글 작성 api 호출 결과 --->", response.data);
        return response;
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // createComment 반환해야 버튼 클릭시 호출 가능
  return { data, error, loading, createComment };
}
