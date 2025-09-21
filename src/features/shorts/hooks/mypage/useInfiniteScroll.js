import { useState, useCallback, useEffect } from "react";
import axiosInstance from "../../../../shared/api/axiosInstance";

// 무한스크롤 데이터 관리 훅 (초기, 추가로딩, 에러상태 관리, 페이지네이션 커서)
export const useInfiniteScroll = (apiEndpoint, options = {}) => {
  const {
    userId = 1,
    limit = 8,
    initialData = [],
    processData = (data) => data, // 데이터 가공 함수
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const fetchData = useCallback(
    async (cursor = null, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const params = { userId, limit };
        if (cursor) {
          params.cursor = cursor;
        }

        console.log(`${apiEndpoint} 요청:`, params);
        const response = await axiosInstance.get(apiEndpoint, { params });
        console.log(`${apiEndpoint} 응답:`, response.data);

        const processedData = processData(response.data.items || []);

        if (isLoadMore) {
          setData((prev) => [...prev, ...processedData]);
        } else {
          setData(processedData);
        }

        setHasNext(response.data.hasNext || false);
        setNextCursor(response.data.nextCursor);
        setError(null);

        console.log("Data loaded:", {
          itemsCount: processedData.length,
          hasNext: response.data.hasNext,
          nextCursor: response.data.nextCursor,
          isLoadMore,
        });
      } catch (err) {
        console.error(`${apiEndpoint} 로드 실패:`, err);
        setError(err);
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [apiEndpoint, userId, limit, processData]
  );

  const loadMore = useCallback(() => {
    if (hasNext && !loadingMore && !loading) {
      fetchData(nextCursor, true);
    }
  }, [fetchData, hasNext, loadingMore, loading, nextCursor]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchData();
  }, [apiEndpoint, userId]); // apiEndpoint나 userId가 변경될 때 자동 로드

  const initialize = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasNext,
    nextCursor,
    fetchData,
    loadMore,
    refresh: initialize,
    initialize,
    setData, // 외부에서 데이터를 직접 수정할 때 사용 (구독 취소 등)
  };
};

export default useInfiniteScroll;
