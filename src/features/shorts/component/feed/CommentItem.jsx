const CommentItem = ({ item }) => {
  return (
    <div className="comment-item">
      <div className="comment-profile" />
      <div className="comment-content">
        <div className="comment-meta">
          <span className="comment-user">{item.customerNickname}</span>
          <span className="comment-time">{item.date}</span>
        </div>
        <div className="comment-text">{item.content}</div>
        <div className="comment-actions">
          <button className="reply-btn">답글 달기</button>
          <button className="delete-btn">삭제</button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
