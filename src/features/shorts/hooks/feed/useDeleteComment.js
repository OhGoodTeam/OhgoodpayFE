import shortsApi from "../../api/feed/shortsApi";
import { useState } from "react";

/**
 * 댓글 삭제 요청을 수행하는 커스텀 훅
 */
export function useDeleteComment() {
  const [data, setData] = useState(null); // 삭제 응답 데이터
  const [error, setError] = useState(null); // 에러 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  const deleteComment = async (shortsId, commentId, params) => {
    // 호출 전 상태 초기화
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // 서버 API 호출
      const response = await shortsApi.deleteComment(
        shortsId,
        commentId,
        params
      );

      // 성공 데이터 저장 및 반환
      const result = response?.data;
      setData(result);
      return result;
    } catch (err) {
      // 에러 저장 후 상위에서 핸들링할 수 있도록 재던짐
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, deleteComment };
}
