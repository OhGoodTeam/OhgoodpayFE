import { useNavigate } from "react-router-dom";
const FeedVideoInfoWidget = ({ item, onSubscribeClick }) => {
  const navigate = useNavigate();
  return (
    <div className="video-info">
      <div
        className="user-info"
        onClick={() => {
          navigate(`/shorts/profile?targetId=${item.customerId}`);
        }}
      >
        <div
          className="profile-pic"
          style={{
            backgroundImage: `url(${`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${item.profileImg}`})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="user-details">
          <span className="username" style={{ width: "120px" }}>
            {item.customerNickname || item.nickname}
          </span>
          <button
            className="subscribe-btn"
            onClick={(e) => {
              e.stopPropagation(); // 부모 onClick 차단
              onSubscribeClick(item.customerId);
            }}
          >
            구독
          </button>
        </div>
      </div>
      <div className="video-description">
        {item.shortsName || item.title}
        <br />
        {item.shortsExplain || item.content}
        <br />
        {item.date}
      </div>
    </div>
  );
};

export default FeedVideoInfoWidget;
