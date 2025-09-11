import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const MypageSubscribe = () => {
  const [searchParams] = useSearchParams();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  // URL에서 userId 가져오기 (기본값 1)
  const userId = searchParams.get("userId") || 1;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/mypage/subscribe", {
          params: { userId, limit: 20 },
        });
        console.log("구독 목록:", response.data);
        console.log(
          "구독자 userId들:",
          response.data.items?.map((item) => item.userId)
        );
        setSubscriptions(response.data.items || []);
        setHasNext(response.data.hasNext || false);
        setNextCursor(response.data.nextCursor);
      } catch (err) {
        console.error("구독 목록 로드 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userId]);

  const handleUnsubscribe = async (targetId) => {
    try {
      console.log("구독 취소 요청:", { userId, targetId });
      const response = await axiosInstance.delete("/api/mypage/subscription", {
        params: { userId, targetId },
      });

      if (response.status === 200) {
        console.log("구독 취소 성공");
        // 구독 목록에서 해당 사용자 제거
        setSubscriptions((prev) =>
          prev.filter((item) => item.userId !== targetId)
        );
        alert("구독이 취소되었습니다.");
      }
    } catch (err) {
      console.error("구독 취소 실패:", err);
      alert("구독 취소에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <main className="subscribe-main">
        <div className="subscribe-container">
          <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="subscribe-main">
        <div className="subscribe-container">
          <div style={{ textAlign: "center", padding: "20px" }}>
            오류가 발생했습니다: {error.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="subscribe-main">
        <div className="subscribe-container">
          {/* 구독 목록 */}
          <div className="subscribe-list">
            {subscriptions.map((item, index) => (
              <div key={item.userId || index} className="subscribe-item">
                <div className="user-profile">
                  {item.avatarUrl ? (
                    <img
                      src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.avatarUrl}`}
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
                <button
                  className="unsubscribe-btn"
                  onClick={() => handleUnsubscribe(item.userId)}
                >
                  구독 취소
                </button>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                구독한 사용자가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default MypageSubscribe;
