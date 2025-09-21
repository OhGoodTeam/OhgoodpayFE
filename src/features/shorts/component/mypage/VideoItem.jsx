// 개별 비디오 카드 컴포넌트
const VideoItem = ({
  item,
  onClick,
  showStats = true,
  showComment = false,
  width = "120px",
  height = "120px",
}) => {
  return (
    <div
      className="video-item"
      style={{
        flexShrink: 0,
        width: width,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onClick={() => onClick(item.videoId || item.shortsId)}
    >
      <div
        className="video-thumbnail"
        style={{
          width: width,
          height: height,
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
        }}
      >
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
          <i
            className="fas fa-play"
            style={{ color: "#666", fontSize: "24px" }}
          />
        )}
      </div>
      <div
        className="video-info"
        style={{
          textAlign: "center",
          width: "100%",
          padding: "0 5px",
          minHeight: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h4
          className="video-title"
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            margin: "0 0 3px 0",
            color: "#fff",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: 1.3,
            maxHeight: "26px",
          }}
        >
          {item.title}
        </h4>
        <p
          className="video-description"
          style={{
            fontSize: "9px",
            color: "#999",
            margin: "0",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: 1.3,
            maxHeight: "22px",
          }}
        >
          {item.content}
        </p>
        {showComment && item.context && (
          <p
            className="comment-context"
            style={{
              fontSize: "8px",
              color: "#66d9ef",
              margin: "2px 0 0 0",
            }}
          >
            내 댓글: {item.context}
          </p>
        )}
        {showStats && (
          <div className="video-stats" style={{ marginTop: "4px" }}>
            <div
              className="stat-item"
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "8px",
              }}
            >
              <i
                className="fas fa-thumbs-up"
                style={{ fontSize: "8px", marginRight: "2px" }}
              />
              <span style={{ fontSize: "8px" }}>{item.likeCount}</span>
            </div>
            <div
              className="stat-item"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <i
                className="fas fa-comment"
                style={{ fontSize: "8px", marginRight: "2px" }}
              />
              <span style={{ fontSize: "8px" }}>{item.commentCount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoItem;
