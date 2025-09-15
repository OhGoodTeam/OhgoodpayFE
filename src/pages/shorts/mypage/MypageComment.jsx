import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const MypageComment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [commentedVideos, setCommentedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  // 무한스크롤을 위한 ref
  const observerRef = useRef();
  const loadingRef = useRef();

  // URL에서 userId 가져오기 (기본값 1)
  const userId = searchParams.get("userId") || 1;

  // 댓글 영상 데이터 가져오기 함수
  const fetchCommentedVideos = useCallback(
    async (cursor = null, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const params = { userId, limit: 8 };
        if (cursor) {
          params.cursor = cursor;
        }

        const response = await axiosInstance.get("/api/mypage/comments", {
          params,
        });
        console.log("댓글 영상 목록:", response.data);

        // 영상 ID 기준으로 중복 제거 (가장 최근 댓글만 유지)
        const uniqueVideos = [];
        const seenVideoIds = new Set();

        (response.data.items || []).forEach((item) => {
          if (!seenVideoIds.has(item.videoId)) {
            seenVideoIds.add(item.videoId);
            uniqueVideos.push(item);
          }
        });

        if (isLoadMore) {
          // 추가 로드인 경우 기존 데이터에 추가
          setCommentedVideos((prev) => [...prev, ...uniqueVideos]);
        } else {
          // 초기 로드인 경우 데이터 교체
          setCommentedVideos(uniqueVideos);
        }

        setHasNext(response.data.hasNext || false);
        setNextCursor(response.data.nextCursor);
        setError(null);

        console.log("Data loaded:", {
          itemsCount: uniqueVideos.length,
          hasNext: response.data.hasNext,
          nextCursor: response.data.nextCursor,
          isLoadMore,
        });
      } catch (err) {
        console.error("댓글 영상 목록 로드 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId]
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchCommentedVideos();
  }, [fetchCommentedVideos]);

  // 무한스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log("Intersection Observer triggered:", {
          isIntersecting: target.isIntersecting,
          hasNext,
          loadingMore,
          loading,
          nextCursor,
        });

        if (target.isIntersecting && hasNext && !loadingMore && !loading) {
          console.log("Loading more videos with cursor:", nextCursor);
          fetchCommentedVideos(nextCursor, true);
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
      console.log("loadingRef.current is null");
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasNext, loadingMore, loading, nextCursor, fetchCommentedVideos]);

  if (loading) {
    return (
      <main className="liked-videos-main">
        <div className="liked-videos-container">
          <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="liked-videos-main">
        <div className="liked-videos-container">
          <div style={{ textAlign: "center", padding: "20px" }}>
            오류가 발생했습니다: {error.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>
        {`
          .liked-videos-list::-webkit-scrollbar {
            display: none;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
          }
        `}
      </style>
      {/* 메인 컨텐츠 */}
      <main className="liked-videos-main">
        <div className="liked-videos-container">
          {/* 페이지 제목 */}
          <h1 className="page-title">댓글 단 영상</h1>

          {/* 영상 목록 */}
          <div
            className="liked-videos-list"
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {commentedVideos.map((item, index) => (
              <div
                key={`${item.videoId}-${index}`}
                className="shorts-video-item"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/shorts/feed?shortsId=${item.videoId}`)
                }
              >
                <div className="video-thumbnail">
                  {item.thumbnailUrl ? (
                    <img
                      src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.thumbnailUrl}`}
                      alt="썸네일"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="fas fa-play" />
                  )}
                </div>
                <div className="video-info">
                  <h3 className="video-title">{item.title}</h3>
                  <p className="video-description">{item.content}</p>
                  {item.context && (
                    <p className="comment-context">내 댓글: {item.context}</p>
                  )}
                  <div className="video-stats">
                    <div className="stat-item">
                      <i className="fas fa-thumbs-up" />
                      <span>{item.likeCount}</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-comment" />
                      <span>{item.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

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
                <>
                  <div className="loading-spinner"></div>더 많은 영상을 불러오는
                  중...
                </>
              ) : hasNext ? (
                <div style={{ color: "#999", fontSize: "14px" }}>
                  스크롤하여 더 많은 영상 보기
                </div>
              ) : commentedVideos.length > 0 ? (
                <div style={{ color: "#999", fontSize: "14px" }}>
                  모든 댓글 영상을 불러왔습니다.
                </div>
              ) : null}
            </div>

            {commentedVideos.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                댓글을 단 영상이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default MypageComment;
