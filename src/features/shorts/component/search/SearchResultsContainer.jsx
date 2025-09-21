// 스크롤 가능한 검색 결과 컨테이너 (검색 결과 전체를 감싸는 컨테이너)
const SearchResultsContainer = ({ children }) => {
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
      <div
        className="search-results"
        style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default SearchResultsContainer;
