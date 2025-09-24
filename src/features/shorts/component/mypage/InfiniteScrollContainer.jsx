import { useRef, useEffect } from "react";

// 무한스크롤 컨테이너 컴포넌트
const InfiniteScrollContainer = ({
  items = [],
  loading,
  loadingMore,
  hasNext,
  onLoadMore,
  renderItem,
  emptyMessage = "데이터가 없습니다",
  loadingMessage = "더 많은 데이터를 불러오는 중...",
  noMoreMessage = "모든 데이터를 불러왔습니다",
  scrollMessage = "스크롤하여 더 많은 데이터 보기",
  containerStyle = {},
  itemKey = "id",
}) => {
  const loadingRef = useRef();

  // 무한스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && hasNext && !loadingMore && !loading) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasNext, loadingMore, loading, onLoadMore]);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .infinite-scroll-container::-webkit-scrollbar {
            display: none;
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
      <div
        className="infinite-scroll-container"
        style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          ...containerStyle,
        }}
      >
        {/* 아이템들 렌더링 */}
        {items.map((item, index) =>
          renderItem(item, index, item[itemKey] || index)
        )}

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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="loading-spinner"></div>
              {loadingMessage}
            </div>
          ) : hasNext ? (
            <div style={{ color: "#999", fontSize: "14px" }}>
              {scrollMessage}
            </div>
          ) : items.length > 0 ? (
            <div style={{ color: "#999", fontSize: "14px" }}>
              {noMoreMessage}
            </div>
          ) : null}
        </div>

        {/* 빈 데이터 메시지 */}
        {items.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            {emptyMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default InfiniteScrollContainer;
