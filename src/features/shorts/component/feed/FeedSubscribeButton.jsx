const FeedSubscribeButton = ({ onClick }) => {
  return (
    <button
      style={{ width: "inherit" }}
      className="subscribe-btn"
      onClick={(e) => onClick(e)}
    >
      구독
    </button>
  );
};
export default FeedSubscribeButton;
