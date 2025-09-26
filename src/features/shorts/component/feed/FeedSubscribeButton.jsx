const FeedSubscribeButton = () => {
  return (
    <button
      style={{ width: "inherit" }}
      className="subscribe-btn"
      onClick={(e) => handleSubscribeClick(e)}
    >
      구독
    </button>
  );
};
export default FeedSubscribeButton;
