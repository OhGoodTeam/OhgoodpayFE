const VideoItem = ({ item, onClick }) => {
  return (
    <div className="video-item" onClick={() => onClick(item.shortsId)}>
      <div className="video-thumbnail">
        {item.thumbnail ? (
          <img
            src={`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${item.thumbnail}`}
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
        <div className="video-overlay">
          <div className="like-count">
            <i className="fas fa-thumbs-up" />
            <span>{item.likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
