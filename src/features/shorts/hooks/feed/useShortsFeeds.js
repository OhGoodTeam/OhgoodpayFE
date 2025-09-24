// useShortsFeeds.js - 렌더링 방지 버전
import { useEffect, useState } from "react";
import shortsApi from "../../api/feed/shortsApi";

export function useShortsFeeds({
  page,
  size,
  keyword,
  customerId,
  enabled = true,
}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 추가 로딩 상태

  useEffect(() => {
    // enabled가 false면 실행하지 않음
    if (!enabled) return;

    const fetchFeeds = async () => {
      // 첫 페이지는 isLoading, 추가 페이지는 isLoadingMore 사용
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const newData = await shortsApi.getFeeds({
          page,
          size,
          keyword,
          customerId,
        });

        setData((prev) => {
          if (page === 1) {
            return newData; // 첫 페이지는 새로 설정
          } else {
            // 중복 제거: shortsId 기준으로 중복 제거
            const existingIds = new Set(prev.map((item) => item.shortsId));
            const uniqueNewData = newData.filter(
              (item) => !existingIds.has(item.shortsId)
            );
            return [...prev, ...uniqueNewData]; // 중복 제거된 데이터만 추가
          }
        });
      } catch (error) {
        setError(error);
      } finally {
        if (page === 1) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    };

    fetchFeeds();
  }, [page, size, keyword, enabled]);

  return { data, error, isLoading, isLoadingMore };
}
