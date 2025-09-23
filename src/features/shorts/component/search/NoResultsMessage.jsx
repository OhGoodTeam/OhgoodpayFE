// 검색 결과가 없을때 표시되는 메시지
const NoResultsMessage = ({ searchQuery, isVisible }) => {
  if (!isVisible) return null;

  return (
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
            앗! {searchQuery || "검색어"}의 검색결과가 없어요.
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
  );
};

export default NoResultsMessage;
