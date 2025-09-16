import { useEffect, useState } from "react";
import shortsApi from "../../api/feed/shortsApi";

// 댓글 조회 api
export function useShortsComments({ shortsId, isCommentModalOpen }) {
  const [data, setData] = useState([]); // 댓글 데이터
  const [error, setError] = useState(null); // 댓글 에러
  const [loading, setLoading] = useState(true); // 댓글 로딩

  // 댓글 목록 새로고침 함수
  const refetchComments = async () => {
    if (shortsId) {
      // shortsId만 확인 (isCommentModalOpen 조건 제거)
      console.log("댓글 목록 새로고침 시작:", shortsId);
      setLoading(true);
      try {
        const response = await shortsApi.getComments(shortsId);
        console.log("댓글 목록 새로고침 성공:", response);
        setData(response);
      } catch (error) {
        console.error("댓글 목록 새로고침 실패:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("shortsId가 없어서 댓글 목록 새로고침 안함");
    }
  };

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

  return { data, error, loading, refetchComments };
}
