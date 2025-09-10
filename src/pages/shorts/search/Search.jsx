import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // 검색 API 호출 함수
  const fetchSearchResults = useCallback(
    async (query, cursor = null, isLoadMore = false) => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        const params = {
          q: query,
          limit: 20,
        };

        // 커서가 있으면 추가 (무한스크롤용)
        if (cursor) {
          params.lastId = cursor.lastId;
          params.lastDate = cursor.lastDate;
          params.lastScore = cursor.lastScore;
        }

        console.log("검색 요청:", params);
        const response = await axiosInstance.get("/api/search", { params });
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
      } catch (error) {
        console.error("검색 오류:", error);
        alert("검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    []
  );

  // 초기 검색 실행
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query.trim()) {
      fetchSearchResults(query);
    }
  }, [searchParams, fetchSearchResults]);

  // 무한스크롤 옵저버 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const query = searchParams.get("q");
        if (
          entries[0].isIntersecting &&
          hasNext &&
          !loading &&
          query &&
          query.trim()
        ) {
          console.log("무한스크롤 트리거:", nextCursor);
          fetchSearchResults(query, nextCursor, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasNext, loading, searchParams, nextCursor, fetchSearchResults]);

  // 썸네일 클릭 시 해당 영상으로 이동
  const handleThumbnailClick = (shortsId) => {
    navigate(`/shorts/feed?shortsId=${shortsId}`);
  };

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="search-main">
        <div className="search-container">
          {/* 검색 결과 */}
          {!isInitialLoad && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                <>
                  <div className="search-grid" id="searchGrid">
                    {searchResults.map((item) => (
                      <div
                        key={item.shortsId}
                        className="search-card"
                        data-id={item.shortsId}
                        onClick={() => handleThumbnailClick(item.shortsId)}
                      >
                        <div className="card-thumbnail">
                          {item.thumbnail ? (
                            <img
                              src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.thumbnail}`}
                              alt="썸네일"
                              className="thumbnail-image"
                              onLoad={() =>
                                console.log("썸네일 로드 성공:", item.thumbnail)
                              }
                              onError={(e) => {
                                console.error(
                                  "썸네일 로드 실패:",
                                  item.thumbnail,
                                  e
                                );
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="thumbnail-placeholder"
                            style={{
                              display: item.thumbnail ? "none" : "flex",
                            }}
                          >
                            <i className="fas fa-play" />
                          </div>
                          <div className="card-overlay">
                            <div className="like-count">
                              <i className="fas fa-thumbs-up" />
                              <span>{item.likeCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 무한스크롤 로딩 인디케이터 */}
                  {hasNext && (
                    <div ref={loadingRef} className="loading-indicator">
                      {loading ? (
                        <div className="loading-spinner">
                          <i className="fas fa-spinner fa-spin" />
                          <span>로딩 중...</span>
                        </div>
                      ) : (
                        <div className="load-more-trigger" />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <i className="fas fa-search" />
                  <p>검색 결과가 없습니다.</p>
                  <span>다른 검색어를 시도해보세요.</span>
                </div>
              )}
            </div>
          )}

          {/* 초기 로딩 */}
          {isInitialLoad && loading && (
            <div className="initial-loading">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin" />
                <span>검색 중...</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
export default Search;
