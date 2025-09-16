import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerRef = useRef(null);
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
        const response = await axiosInstance.get("/search", { params });
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
    navigate(`/shorts/feed?shortsId=${shortsId}`);
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .search-results::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* 메인 컨텐츠 */}
      <main className="search-main">
        <div className="search-container">
          {/* 검색 결과 */}
          <div
            className="search-results"
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
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

                {/* 무한스크롤 트리거 요소 */}
                <div
                  ref={loadingRef}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {loadingMore ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          border: "2px solid #f3f3f3",
                          borderTop: "2px solid #3498db",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      더 많은 영상을 불러오는 중...
                    </div>
                  ) : hasNext ? (
                    <div style={{ color: "#999", fontSize: "14px" }}>
                      스크롤하여 더 많은 영상 보기
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div style={{ color: "#999", fontSize: "14px" }}>
                      모든 검색 결과를 불러왔습니다.
                    </div>
                  ) : null}
                </div>
              </>
            ) : !isInitialLoad ? (
              <div
                className="no-results"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "calc(100vh - 200px)",
                  textAlign: "center",
                  color: "#fff",
                  padding: "40px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <img
                    src="/src/shared/assets/img/shortsSearch.png"
                    alt="검색 결과 없음"
                    style={{
                      width: "200px",
                      height: "auto",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        margin: "0",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      앗! {searchParams.get("q") || "검색어"}의 검색결과가
                      없어요.
                    </p>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#999",
                        margin: "0",
                      }}
                    >
                      다른 검색어를 시도해보세요.
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

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
