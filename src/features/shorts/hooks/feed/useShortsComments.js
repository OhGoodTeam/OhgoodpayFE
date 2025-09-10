import { useEffect, useState } from "react";
import shortsApi from "../../api/feed/shortsApi";

// 댓글 조회 api
export function useShortsComments({ shortsId, isCommentModalOpen }) {
  const [data, setData] = useState([]); // 댓글 데이터
  const [error, setError] = useState(null); // 댓글 에러
  const [loading, setLoading] = useState(true); // 댓글 로딩

  useEffect(() => {
    const fetchComments = async () => {
      if (isCommentModalOpen && shortsId) {
        try {
          // 댓글 데이터 저장
          const response = await shortsApi.getComments(shortsId);
          setData(response);
        } catch (error) {
          // 에러 저장
          setError(error);
        } finally {
          // 로딩 상태 저장
          setLoading(false);
        }
      }
    };

    fetchComments();
  }, [isCommentModalOpen, shortsId]);

  return { data, error, loading };
}
