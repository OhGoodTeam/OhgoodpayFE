import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRequireLogin } from "../../hooks/feed/useRequireLogin";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const FeedVideoInfoWidget = ({
  item,
  onSubscribeClick,
  onUnsubscribeClick,
  onclick,
  subscriptionStates,
}) => {
  const navigate = useNavigate();

  // 구독 state
  const [subscribe, setSubscribe] = useState(subscriptionStates || "구독");

  const [isExpanded, setIsExpanded] = useState(false);
  // 로그인 체크
  const { requireLogin } = useRequireLogin();

  useEffect(() => {
    if (item.subscriptionStatus == "SUBSCRIBED") {
      setSubscribe("구독중");
    } else if (item.subscriptionStatus == "NOT_SUBSCRIBED") {
      setSubscribe("구독");
    }
    if (subscriptionStates) {
      setSubscribe(subscriptionStates);
    }
  }, [subscriptionStates]);

  // 타이틀 클릭 시 슬라이드업
  const handleTitleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  // 피드 페이지 구독 버튼
  const handleSubscribeClick = async (e) => {
    e.stopPropagation(); // 부모 onClick 차단
    const ok = await requireLogin();
    if (!ok) return;
    if (subscribe == "구독") onSubscribeClick(item.customerId);
    else if (subscribe == "구독중") onUnsubscribeClick(item.customerId);
  };

  return (
    <div className="video-info" onClick={onclick}>
      <div
        className="user-info"
        onClick={async () => {
          const ok = await requireLogin();
          if (!ok) return;
          navigate(`/shorts/profile?targetId=${item.customerId}`);
        }}
      >
        {item.profileImg ? (
          <div
            className="profile-pic"
            style={{
              backgroundImage: `url(${`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${item.profileImg}`})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div className="profile-pic">
            <i className="fas fa-user" />
          </div>
        )}

        <div className="user구-details">
          <span className="username">
            {item.customerNickname || item.nickname}
          </span>
          {/* <FeedSubscribeButton onClick={handleSubscribeClick} /> */}
          {item.subscriptionStatus !== "SELF" && (
            <button
              style={{ width: "inherit", marginLeft: "8px" }}
              className="subscribe-btn"
              onClick={(e) => handleSubscribeClick(e)}
            >
              {subscribe}
            </button>
          )}
        </div>
      </div>
      <div
        className={`video-description ${isExpanded ? "expanded" : ""}`}
        onClick={handleTitleClick}
      >
        {item.shortsName || item.title}
        <br />
        {item.shortsExplain || item.content}
        <br />
        <span style={{ marginTop: "18px", display: "block" }}>
          {formatDistanceToNow(new Date(item.date), {
            addSuffix: true,
            locale: ko,
          })}
        </span>
      </div>
    </div>
  );
};

export default FeedVideoInfoWidget;
