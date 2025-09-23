const SubscribeButton = ({ value, onClick }) => {
  return (
    <button className="subscribe-btn" onClick={onClick}>
      {value}
    </button>
  );
};

export default SubscribeButton;
