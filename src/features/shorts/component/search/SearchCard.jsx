// 개별 검색 결과 카드(썸네일, 좋아요 수)
const SearchCard = ({ item, onThumbnailClick }) => {
  const handleImageError = (e) => {
    console.error("썸네일 로드 실패:", item.thumbnail, e);
    e.target.style.display = "none";
    e.target.nextSibling.style.display = "flex";
  };

  return (
    <div
      key={item.shortsId}
      className="search-card"
      data-id={item.shortsId}
      onClick={() => onThumbnailClick(item.shortsId)}
    >
      <div className="card-thumbnail">
        {item.thumbnail ? (
          <img
            src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.thumbnail}`}
            alt="썸네일"
            className="thumbnail-image"
            onLoad={() => console.log("썸네일 로드 성공:", item.thumbnail)}
            onError={handleImageError}
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
  );
};

export default SearchCard;
