import { useEffect, useRef } from "react";
import { useShortsComments } from "../../hooks/feed/useShortsComments";
import { useCreateShortsComment } from "../../hooks/feed/useCreateShortsComment";
import CommentItem from "./CommentItem";

const FeedCommentWidget = ({
  commentModalRef,
  handleCommentClick,
  shortsId,
  isCommentModalOpen,
}) => {
  // 댓글 조회 api
  const {
    data: comments,
    error,
    loading,
    refetchComments,
  } = useShortsComments({ shortsId, isCommentModalOpen });

  // 댓글 작성 api
  const {
    createComment,
    // data: createData,
    // error: createError,
    // loading: createLoading,
  } = useCreateShortsComment();

  // 댓글 입력 폼
  const commentInputRef = useRef(null);

  // 댓글 입력 버튼 submit 이벤트
  const handleCommentSubmit = async () => {
    const content = commentInputRef.current.value;

    if (!content) return; // 빈 댓글 방지

    try {
      const result = await createComment(shortsId, {
        customerId: 1,
        content,
        gno: 0,
      });

      console.log("댓글 작성 성공: ", result);

      // 댓글 작성 성공 시 댓글 목록 새로고침
      if (result.success) {
        console.log("댓글 작성 성공, 댓글 목록 새로고침 시작");
        console.log("현재 shortsId:", shortsId);
        await refetchComments(); // 댓글 목록 다시 조회
        console.log("댓글 목록 새로고침 완료");

        // 입력 필드 초기화
        commentInputRef.current.value = "";
      }
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  useEffect(() => {
    commentInputRef.current.value = ""; // 입력 필드 초기화
  }, [shortsId]);

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
        ) : comments && comments.length > 0 ? (
          comments.map((item) => (
            <CommentItem key={item.commentId} item={item} />
          ))
        ) : (
          <div className="comment-empty">
            <img
              src="/src/shared/assets/img/shorts-empty.png"
              alt="댓글이 없습니다"
              className="empty-image"
            />
            <h3 className="empty-title">아직 댓글이 없습니다</h3>
            <p className="empty-description">첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </div>
      <div className="comment-input">
        <div className="input-profile" />
        <input
          type="text"
          placeholder="댓글을 달려면 로그인하세요"
          ref={commentInputRef}
        />
        <button className="send-btn" onClick={handleCommentSubmit}>
          <i className="fas fa-arrow-up" />
        </button>
      </div>

      {/* 답글 달기 폼 */}
      <div className="reply-form" id="replyForm">
        <div className="reply-form-header">
          <span className="reply-to-user">@사용자명에게 답글</span>
          <button className="reply-close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="reply-form-content">
          <div className="reply-input-container">
            <div className="reply-profile"></div>
            <div className="reply-input-wrapper">
              <input
                className="reply-textarea"
                placeholder="답글을 입력하세요..."
              />
            </div>
          </div>

          <div className="reply-form-actions">
            <button className="reply-cancel-btn">취소</button>
            <button className="reply-submit-btn">답글 달기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCommentWidget;
