import SearchCard from "./SearchCard";

// 검색 결과를 그리드로 표시
const SearchGrid = ({ searchResults, onThumbnailClick }) => {
  return (
    <div className="search-grid" id="searchGrid">
      {searchResults.map((item) => (
        <SearchCard
          key={item.shortsId}
          item={item}
          onThumbnailClick={onThumbnailClick}
        />
      ))}
    </div>
  );
};

export default SearchGrid;
