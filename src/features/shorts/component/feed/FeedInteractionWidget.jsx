import { useCallback } from "react";
import { useCreateReaction } from "../../hooks/feed/useCreateReaction";

const FeedInteractionWidget = ({
  handleUploadClick,
  handleCameraClick,
  handleGalleryClick,
  uploadContainerRef,
  showUploadOptions,
  handleCommentClick,
  handleShareClick,
  currentShortsId,
  currentShortsCommentCount,
  currentShortsLikeCount,
  myReaction,
  onReactionSuccess,
}) => {
  const { createReaction } = useCreateReaction();

  const calculateLikeCount = useCallback((isCanceling, currentCount) => {
    return isCanceling ? Math.max(0, currentCount - 1) : currentCount + 1;
  }, []);

  const handleReactionClick = useCallback(
    async (type) => {
      if (!currentShortsId || !onReactionSuccess) return;

      const isCanceling = myReaction === type;

      try {
        const result = await createReaction(currentShortsId, {
          customerId: 1,
          shortsId: currentShortsId,
          type,
        });

        // 백엔드에서 올바른 카운트를 반환한 경우
        if (result && typeof result.likeCount === "number") {
          onReactionSuccess(result);
        } else {
          // 프론트엔드에서 계산
          const newLikeCount = calculateLikeCount(
            isCanceling,
            currentShortsLikeCount
          );
          onReactionSuccess({
            likeCount: newLikeCount,
            myReaction: isCanceling ? null : type,
          });
        }
      } catch (error) {
        // console.error("반응 API 호출 실패:", error);

        // API 실패 시에도 프론트엔드에서 처리
        const newLikeCount = calculateLikeCount(
          isCanceling,
          currentShortsLikeCount
        );
        onReactionSuccess({
          likeCount: newLikeCount,
          myReaction: isCanceling ? null : type,
        });
      }
    },
    [
      currentShortsId,
      myReaction,
      currentShortsLikeCount,
      onReactionSuccess,
      createReaction,
      calculateLikeCount,
    ]
  );

  const InteractionButton = ({ type, icon, label, count, className }) => (
    <button
      className={`${className} ${myReaction === type ? "active" : ""}`}
      onClick={() => handleReactionClick(type)}
    >
      <i className={icon} />
      <span>{count !== undefined ? count : label}</span>
    </button>
  );

  return (
    <div className="interaction-bar">
      <div className="upload-container" ref={uploadContainerRef}>
        <button className="upload-btn" onClick={handleUploadClick}>
          <i className="fas fa-plus" />
          <span>업로드</span>
        </button>

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

      <InteractionButton
        type="like"
        icon="fas fa-thumbs-up"
        count={currentShortsLikeCount}
        className="like-btn"
      />

      <InteractionButton
        type="dislike"
        icon="fas fa-thumbs-down"
        label="싫어요"
        className="dislike-btn"
      />

      <button className="comment-btn" onClick={handleCommentClick}>
        <i className="fas fa-comment" />
        <span>{currentShortsCommentCount}</span>
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
