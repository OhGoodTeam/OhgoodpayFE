import { useNavigate } from "react-router-dom";
// 구독자 아이템 컴포넌트
const SubscriptionItem = ({
  item,
  onUnsubscribe,
  showUnsubscribeButton = false,
  isHorizontal = false,
}) => {
  const navigate = useNavigate();
  if (isHorizontal) {
    // 가로 스크롤용 (Mypage.jsx의 구독 섹션)
    return (
      <div
        className="subscription-item"
        style={{ flexShrink: 0 }}
        onClick={() => {
          navigate(`/shorts/profile?targetId=${item.userId}`);
        }}
      >
        <div className="sub-profile">
          <img
            src={`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${item.avatarUrl}`}
            alt="구독자 프로필"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <span className="sub-name">{item.displayName}</span>
      </div>
    );
  }

  // 세로 리스트용 (MypageSubscribe.jsx)
  return (
    <div
      className="subscribe-item"
      onClick={() => {
        navigate(`/shorts/profile?targetId=${item.userId}`);
      }}
    >
      <div className="user-profile">
        {item.avatarUrl ? (
          <img
            src={`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${item.avatarUrl}`}
            alt="프로필"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <i className="fas fa-user" />
        )}
      </div>
      <div className="user-info">
        <span className="username">{item.displayName}</span>
      </div>
      {showUnsubscribeButton && (
        <button
          className="unsubscribe-btn"
          onClick={() => onUnsubscribe(item.userId)}
        >
          구독 취소
        </button>
      )}
    </div>
  );
};

export default SubscriptionItem;
