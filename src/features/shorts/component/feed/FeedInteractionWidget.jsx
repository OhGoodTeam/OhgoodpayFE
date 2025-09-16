import { useEffect } from "react";

const FeedInteractionWidget = ({
  handleUploadClick,
  handleCameraClick,
  handleGalleryClick,
  uploadContainerRef,
  showUploadOptions,
  handleCommentClick,
  handleShareClick,
  currentShortsId,
}) => {
  useEffect(() => {
    console.log(currentShortsId);
  }, [currentShortsId]);
  return (
    <div className="interaction-bar">
      <div className="upload-container" ref={uploadContainerRef}>
        <button className="upload-btn" onClick={handleUploadClick}>
          <i className="fas fa-plus" />
          <span>업로드</span>
        </button>

        {/* 업로드 옵션 토글 */}
        {showUploadOptions && (
          <div className="upload-options">
            <button className="upload-option-btn" onClick={handleCameraClick}>
              <i className="fas fa-camera" />
              <span>카메라</span>
            </button>
            <button className="upload-option-btn" onClick={handleGalleryClick}>
              <i className="fas fa-images" />
              <span>갤러리</span>
            </button>
          </div>
        )}
      </div>
      {/* 좋아요 */}
      <button className="like-btn">
        <i className="fas fa-thumbs-up" />
        <span>99</span>
      </button>
      {/* 싫어요 */}
      <button className="dislike-btn">
        <i className="fas fa-thumbs-down" />
        <span>싫어요</span>
      </button>
      {/* 댓글 */}
      <button
        className="comment-btn"
        id="commentToggle"
        onClick={handleCommentClick}
      >
        <i className="fas fa-comment" />
        <span>99</span>
      </button>
      {/* 공유 */}
      <button className="share-btn" onClick={handleShareClick}>
        <i className="fas fa-paper-plane" />
        <span>공유</span>
      </button>
    </div>
  );
};

export default FeedInteractionWidget;
