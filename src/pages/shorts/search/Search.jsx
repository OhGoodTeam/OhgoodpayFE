import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

// 분리된 컴포넌트들 import
import SearchResultsContainer from "../../../features/shorts/component/search/SearchResultsContainer";
import SearchGrid from "../../../features/shorts/component/search/SearchGrid";
import InfiniteScrollTrigger from "../../../features/shorts/component/search/InfiniteScrollTrigger";
import NoResultsMessage from "../../../features/shorts/component/search/NoResultsMessage";
import LoadingSpinner from "../../../features/shorts/component/search/LoadingSpinner";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 로그인 상태 확인 함수
  const isLoggedIn = () => {
    const token = sessionStorage.getItem('accessToken');
    return !!token;
  };
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const loadingRef = useRef(null);

  // 검색 API 호출 함수
  const fetchSearchResults = useCallback(
    async (query, cursor = null, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const params = {
          limit: 8,
        };

        // 검색어가 있으면 q 파라미터 추가
        if (query && query.trim()) {
          params.q = query.trim();
        }

        // 커서가 있으면 추가 (무한스크롤용)
        if (cursor) {
          params.lastId = cursor.lastId;
          params.lastDate = cursor.lastDate;
          params.lastScore = cursor.lastScore;
        }

        console.log("검색 요청:", params);
        const response = await axiosInstance.get("/api/public/shorts/search", {
          params,
        });
        console.log("검색 응답:", response.data);
        console.log("검색 결과 items:", response.data.items);

        const {
          items,
          nextCursor: newNextCursor,
          hasNext: newHasNext,
        } = response.data;

        if (isLoadMore) {
          // 무한스크롤: 기존 결과에 추가
          setSearchResults((prev) => [...prev, ...items]);
        } else {
          // 새로운 검색: 결과 교체
          setSearchResults(items);
        }

        setNextCursor(newNextCursor);
        setHasNext(newHasNext);

        console.log("Data loaded:", {
          itemsCount: items?.length || 0,
          hasNext: newHasNext,
          nextCursor: newNextCursor,
          isLoadMore,
        });
      } catch (error) {
        console.error("검색 오류:", error);
        alert("검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setIsInitialLoad(false);
      }
    },
    []
  );


  // 초기 검색 실행
  useEffect(() => {
    const query = searchParams.get("q");
    // 검색어가 있든 없든 API 요청 (빈 검색어는 전체 영상 조회)
    fetchSearchResults(query || "");
  }, [searchParams, fetchSearchResults]);

  // 무한스크롤 옵저버 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        const query = searchParams.get("q");

        console.log("Intersection Observer triggered:", {
          isIntersecting: target.isIntersecting,
          hasNext,
          loadingMore,
          loading,
          nextCursor,
        });

        if (target.isIntersecting && hasNext && !loadingMore && !loading) {
          console.log("Loading more search results with cursor:", nextCursor);
          fetchSearchResults(query || "", nextCursor, true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    if (loadingRef.current) {
      console.log("Observer attached to loadingRef");
      observer.observe(loadingRef.current);
    } else {
      console.log(
        "loadingRef.current is null - 무한스크롤 트리거 요소가 DOM에 없습니다"
      );
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [
    hasNext,
    loadingMore,
    loading,
    searchParams,
    nextCursor,
    fetchSearchResults,
  ]);

  // 썸네일 클릭 시 해당 영상으로 이동
  const handleThumbnailClick = (shortsId) => {
    navigate(`/shorts/feeds?shortsId=${shortsId}`);
  };

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="search-main">
        <div className="search-container">
          {/* SearchResultsContainer 컴포넌트 */}
          <SearchResultsContainer>
            {searchResults.length > 0 ? (
              <>
                {/* SearchGrid 컴포넌트 */}
                <SearchGrid
                  searchResults={searchResults}
                  onThumbnailClick={handleThumbnailClick}
                />

                {/* InfiniteScrollTrigger 컴포넌트 */}
                <InfiniteScrollTrigger
                  loadingMore={loadingMore}
                  hasNext={hasNext}
                  searchResultsCount={searchResults.length}
                  loadingRef={loadingRef}
                />
              </>
            ) : (
              /* NoResultsMessage 컴포넌트 */
              <NoResultsMessage
                searchQuery={searchParams.get("q")}
                isVisible={!isInitialLoad}
              />
            )}
          </SearchResultsContainer>

          {/* LoadingSpinner 컴포넌트 */}
          <LoadingSpinner
            isVisible={isInitialLoad && loading}
            message="검색 중..."
          />
        </div>
      </main>
    </>
  );
};

export default Search;
