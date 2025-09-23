// 무한스크롤 로딩 및 상태 메시지
const InfiniteScrollTrigger = ({
  loadingMore,
  hasNext,
  searchResultsCount,
  loadingRef,
}) => {
  return (
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
      ) : searchResultsCount > 0 ? (
        <div style={{ color: "#999", fontSize: "14px" }}>
          모든 검색 결과를 불러왔습니다.
        </div>
      ) : null}
    </div>
  );
};

export default InfiniteScrollTrigger;
