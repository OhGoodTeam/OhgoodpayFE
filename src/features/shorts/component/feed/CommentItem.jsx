const CommentItem = ({ item }) => {
  const handleReplyClick = (item) => {
    console.log("답글 달기");
    console.log(item);
  };
  return (
    <div className="comment-item" data-comment-id={item.commentId}>
      <img
        className="comment-profile"
        src={
          "https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/" + item.profileImg
        }
      />
      <div className="comment-content">
        <div className="comment-meta">
          <span className="comment-user">{item.nickname}</span>
          <span className="comment-time">{item.date}</span>
        </div>
        <div className="comment-text">{item.content}</div>
        <div className="comment-actions">
          <button className="reply-btn" onClick={() => handleReplyClick(item)}>
            <i className="fas fa-reply"></i>
            답글 달기
          </button>
          <button className="delete-btn">삭제</button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
