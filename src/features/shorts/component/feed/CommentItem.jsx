import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const CommentItem = ({ item, onReplyClick }) => {
  return (
    <>
      <div className={`comment-item`} data-comment-id={item.commentId}>
        <img
          className="comment-profile"
          src={
            "https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/" +
            item.profileImg
          }
        />
        <div className="comment-content">
          <div className="comment-meta">
            <span className="comment-user">{item.nickname}</span>
            <span className="comment-time">
              {formatDistanceToNow(new Date(item.date), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
          <div className="comment-text">{item.content}</div>
          <div className="comment-actions">
            <button className="reply-btn" onClick={() => onReplyClick(item)}>
              <i className="fas fa-reply"></i>
              답글 달기
            </button>
            <button className="delete-btn">삭제</button>
          </div>
        </div>
      </div>

      {/* 대댓글  */}
      {item.replies &&
        item.replies.length > 0 &&
        item.replies.map((reply) => (
          <div
            className={`comment-item reply`}
            data-comment-id={reply.commentId}
          >
            <img
              className="comment-profile"
              src={
                "https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/" +
                reply.profileImg
              }
            />
            <div className="comment-content">
              <div className="comment-meta">
                <span className="comment-user">{reply.nickname}</span>
                <span className="comment-time">
                  {formatDistanceToNow(new Date(reply.date), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
              </div>
              <div className="comment-text">{reply.content}</div>
              <div className="comment-actions">
                <button
                  style={{ display: "none" }}
                  className="reply-btn"
                  onClick={() => onReplyClick(reply)}
                >
                  <i className="fas fa-reply"></i>
                  답글 달기
                </button>
                <button className="delete-btn">삭제</button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default CommentItem;
