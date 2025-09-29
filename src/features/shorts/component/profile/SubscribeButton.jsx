const SubscribeButton = ({ value, onClick, option = undefined }) => {
  return (
    <button
      className="subscribe-btn"
      onClick={onClick}
      style={{ flexShrink: option === "flex" ? 1 : undefined }}
    >
      {value}
    </button>
  );
};

export default SubscribeButton;
