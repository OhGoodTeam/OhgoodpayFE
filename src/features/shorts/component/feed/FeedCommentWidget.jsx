import { useShortsComments } from "../../hooks/feed/useShortsComments";
import CommentItem from "./CommentItem";

const FeedCommentWidget = ({
  commentModalRef,
  handleCommentClick,
  shortsId,
  isCommentModalOpen,
}) => {
  const {
    data: comments,
    error,
    loading,
  } = useShortsComments({ shortsId, isCommentModalOpen });
  console.log(comments);
  console.log(error);
  console.log(loading);
  return (
    <div
      className="comment-modal"
      id="commentModal"
      ref={commentModalRef}
      style={{ width: "440px", margin: "0 auto" }}
    >
      <div className="comment-header">
        <h3>댓글</h3>
        <button
          className="close-btn"
          id="closeComment"
          onClick={handleCommentClick}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <div className="comment-list">
        {loading ? (
          <div className="comment-loading">
            <div className="loading-spinner">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="comment-error">
            <p>댓글을 불러올 수 없습니다</p>
          </div>
        ) : comments && comments.length === 0 ? (
          <div className="comment-empty">
            <img
              src="/src/shared/assets/img/shorts-empty.png"
              alt="댓글이 없습니다"
              className="empty-image"
            />
            <h3 className="empty-title">아직 댓글이 없습니다</h3>
            <p className="empty-description">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((item) => (
            <CommentItem key={item.commentId} item={item} />
          ))
        )}
      </div>
      <div className="comment-input">
        <div className="input-profile" />
        <input
          type="text"
          placeholder="user_name\uB2D8\uC5D0\uAC8C \uB313\uAE00 \uCD94\uAC00 ..."
        />
        <button className="send-btn">
          <i className="fas fa-arrow-up" />
        </button>
      </div>
    </div>
  );
};

export default FeedCommentWidget;
