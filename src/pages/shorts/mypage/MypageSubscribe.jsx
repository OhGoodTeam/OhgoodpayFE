import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const MypageSubscribe = () => {
  const [searchParams] = useSearchParams();
  const [subscriptions, setSubscriptions] = useState([]);
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

  // 구독 목록 데이터 가져오기 함수
  const fetchSubscriptions = useCallback(
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

        const response = await axiosInstance.get("/api/mypage/subscribe", {
          params,
        });
        console.log("구독 목록:", response.data);
        console.log(
          "구독자 userId들:",
          response.data.items?.map((item) => item.userId)
        );

        if (isLoadMore) {
          // 추가 로드인 경우 기존 데이터에 추가
          setSubscriptions((prev) => [...prev, ...(response.data.items || [])]);
        } else {
          // 초기 로드인 경우 데이터 교체
          setSubscriptions(response.data.items || []);
        }

        setHasNext(response.data.hasNext || false);
        setNextCursor(response.data.nextCursor);
        setError(null);

        console.log("Data loaded:", {
          itemsCount: response.data.items?.length || 0,
          hasNext: response.data.hasNext,
          nextCursor: response.data.nextCursor,
          isLoadMore,
        });
      } catch (err) {
        console.error("구독 목록 로드 실패:", err);
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
    fetchSubscriptions();
  }, [fetchSubscriptions]);

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
          console.log("Loading more subscriptions with cursor:", nextCursor);
          fetchSubscriptions(nextCursor, true);
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
  }, [hasNext, loadingMore, loading, nextCursor, fetchSubscriptions]);

  const handleUnsubscribe = async (targetId) => {
    try {
      console.log("구독 취소 요청:", { userId, targetId });
      const response = await axiosInstance.delete("/api/mypage/subscription", {
        params: { userId, targetId },
      });

      if (response.status === 200) {
        console.log("구독 취소 성공");
        // 구독 목록에서 해당 사용자 제거
        setSubscriptions((prev) =>
          prev.filter((item) => item.userId !== targetId)
        );
        alert("구독이 취소되었습니다.");
      }
    } catch (err) {
      console.error("구독 취소 실패:", err);
      alert("구독 취소에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <main className="subscribe-main">
        <div className="subscribe-container">
          <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="subscribe-main">
        <div className="subscribe-container">
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
          .subscribe-list::-webkit-scrollbar {
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
      <main className="subscribe-main">
        <div className="subscribe-container">
          {/* 구독 목록 */}
          <div
            className="subscribe-list"
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {subscriptions.map((item, index) => (
              <div key={item.userId || index} className="subscribe-item">
                <div className="user-profile">
                  {item.avatarUrl ? (
                    <img
                      src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.avatarUrl}`}
                      alt="프로필"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="fas fa-user" />
                  )}
                </div>
                <div className="user-info">
                  <span className="username">{item.displayName}</span>
                </div>
                <button
                  className="unsubscribe-btn"
                  onClick={() => handleUnsubscribe(item.userId)}
                >
                  구독 취소
                </button>
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
                  <div className="loading-spinner"></div>더 많은 구독자를
                  불러오는 중...
                </>
              ) : hasNext ? (
                <div style={{ color: "#999", fontSize: "14px" }}>
                  스크롤하여 더 많은 구독자 보기
                </div>
              ) : subscriptions.length > 0 ? (
                <div style={{ color: "#999", fontSize: "14px" }}>
                  모든 구독자를 불러왔습니다.
                </div>
              ) : null}
            </div>

            {subscriptions.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                구독한 사용자가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default MypageSubscribe;
