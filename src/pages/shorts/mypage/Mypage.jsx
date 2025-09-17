import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const Mypage = () => {
  const navigate = useNavigate();
  const [mypageData, setMypageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 임시 userId (실제로는 로그인한 사용자 ID를 사용해야 함)
  const userId = 1;

  useEffect(() => {
    const fetchMypageData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/mypage/${userId}/overview`);
        console.log("마이페이지 데이터:", response.data);
        setMypageData(response.data);
      } catch (err) {
        console.error("마이페이지 데이터 로드 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMypageData();
  }, [userId]);

  const handleViewAll = (type) => {
    switch (type) {
      case "subscribe":
        navigate("/shorts/mypage/subscribe");
        break;
      case "liked":
        navigate("/shorts/mypage/all");
        break;
      case "commented":
        navigate("/shorts/mypage/comments");
        break;
      default:
        break;
    }
  };

  // 드래그 스크롤 기능
  const handleMouseDown = (e) => {
    const container = e.currentTarget;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    container.style.cursor = "grabbing";

    const handleMouseMove = (e) => {
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      container.style.cursor = "grab";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (loading) {
    return (
      <main className="mypage-main">
        <div className="mypage-container">
          <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mypage-main">
        <div className="mypage-container">
          <div style={{ textAlign: "center", padding: "20px" }}>
            오류가 발생했습니다: {error.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>
        {`
          .subscription-list::-webkit-scrollbar,
          .video-list::-webkit-scrollbar {
            display: none;
          }
          
          /* 비디오 아이템 텍스트 개선 */
          .video-title {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-word;
            line-height: 1.3;
            max-height: 26px;
          }
          
          .video-description {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-word;
            line-height: 1.3;
            max-height: 22px;
          }
        `}
      </style>
      {/* 메인 컨텐츠 */}
      <main className="mypage-main">
        <div className="mypage-container">
          {/* 프로필 섹션 */}
          <div className="profile-section">
            <div className="profile-image">
              {mypageData?.header?.avatarUrl ? (
                <img
                  src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${mypageData.header.avatarUrl}`}
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
            <div className="profile-info">
              <h2 className="username">
                {mypageData?.header?.displayName || "사용자"}
              </h2>
              <a href={mypageData?.header?.channelUrl} className="channel-link">
                채널 보기 &gt;
              </a>
            </div>
          </div>

          {/* 구독 섹션 */}
          <div className="subscription-section">
            <h3 className="section-title">구독</h3>
            <div
              className="subscription-list"
              style={{
                overflowX: "auto",
                display: "flex",
                gap: "10px",
                paddingBottom: "10px",
                paddingRight: "10px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                whiteSpace: "nowrap",
                cursor: "grab",
                userSelect: "none",
                minHeight: "80px",
              }}
              onWheel={(e) => {
                e.preventDefault();
                e.currentTarget.scrollLeft += e.deltaY;
              }}
              onMouseDown={handleMouseDown}
            >
              {mypageData?.subscriptions?.items?.map((item, index) => (
                <div
                  key={item.userId || index}
                  className="subscription-item"
                  style={{ flexShrink: 0 }}
                >
                  <div className="sub-profile">
                    {item.avatarUrl ? (
                      <img
                        src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.avatarUrl}`}
                        alt="구독자 프로필"
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
                  <span className="sub-name">{item.displayName}</span>
                </div>
              ))}
              <div
                className="subscription-item view-all"
                onClick={() => handleViewAll("subscribe")}
                style={{ flexShrink: 0 }}
              >
                <span className="view-all-text">전체</span>
              </div>
            </div>
          </div>

          {/* 좋아요 표시한 영상 섹션 */}
          <div className="liked-videos-section">
            <div className="section-header">
              <h3 className="section-title">좋아요 표시한 영상</h3>
              <button
                className="view-all-btn"
                onClick={() => handleViewAll("liked")}
              >
                모두 보기
              </button>
            </div>
            <div
              className="video-list"
              style={{
                overflowX: "auto",
                display: "flex",
                gap: "10px",
                paddingBottom: "10px",
                paddingRight: "10px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                whiteSpace: "nowrap",
                cursor: "grab",
                userSelect: "none",
                minHeight: "200px",
              }}
              onWheel={(e) => {
                e.preventDefault();
                e.currentTarget.scrollLeft += e.deltaY;
              }}
              onMouseDown={handleMouseDown}
            >
              {mypageData?.likedVideos?.items
                ?.slice(0, 5)
                .map((item, index) => (
                  <div
                    key={item.videoId || index}
                    className="video-item"
                    style={{
                      flexShrink: 0,
                      width: "120px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    onClick={() =>
                      navigate(`/shorts/feeds?shortsId=${item.videoId}`)
                    }
                  >
                    <div
                      className="video-thumbnail"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "8px",
                      }}
                    >
                      {item.thumbnailUrl ? (
                        <img
                          src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.thumbnailUrl}`}
                          alt="썸네일"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i
                          className="fas fa-play"
                          style={{ color: "#666", fontSize: "24px" }}
                        />
                      )}
                    </div>
                    <div
                      className="video-info"
                      style={{
                        textAlign: "center",
                        width: "100%",
                        padding: "0 5px",
                        minHeight: "60px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <h4
                        className="video-title"
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          margin: "0 0 3px 0",
                          color: "#fff",
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="video-description"
                        style={{
                          fontSize: "9px",
                          color: "#999",
                          margin: "0",
                        }}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 댓글 단 영상 섹션 */}
          <div className="commented-videos-section">
            <div className="section-header">
              <h3 className="section-title">댓글 단 영상</h3>
              <button
                className="view-all-btn"
                onClick={() => handleViewAll("commented")}
              >
                모두 보기
              </button>
            </div>
            <div
              className="video-list"
              style={{
                overflowX: "auto",
                display: "flex",
                gap: "10px",
                paddingBottom: "10px",
                paddingRight: "10px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                whiteSpace: "nowrap",
                cursor: "grab",
                userSelect: "none",
                minHeight: "200px",
              }}
              onWheel={(e) => {
                e.preventDefault();
                e.currentTarget.scrollLeft += e.deltaY;
              }}
              onMouseDown={handleMouseDown}
            >
              {mypageData?.commentedVideos?.items
                ?.slice(0, 5)
                .map((item, index) => {
                  console.log("댓글 영상 아이템:", item);
                  return (
                    <div
                      key={`${item.videoId}-${index}`}
                      className="video-item"
                      style={{
                        flexShrink: 0,
                        width: "120px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      onClick={() =>
                        navigate(`/shorts/feeds?shortsId=${item.videoId}`)
                      }
                    >
                      <div
                        className="video-thumbnail"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#333",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "8px",
                        }}
                      >
                        {item.thumbnailUrl ? (
                          <img
                            src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.thumbnailUrl}`}
                            alt="썸네일"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i
                            className="fas fa-play"
                            style={{ color: "#666", fontSize: "24px" }}
                          />
                        )}
                      </div>
                      <div
                        className="video-info"
                        style={{
                          textAlign: "center",
                          width: "100%",
                          padding: "0 5px",
                          minHeight: "60px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                      >
                        <h4
                          className="video-title"
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            margin: "0 0 3px 0",
                            color: "#fff",
                          }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="video-description"
                          style={{
                            fontSize: "9px",
                            color: "#999",
                            margin: "0",
                          }}
                        >
                          {item.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              {(!mypageData?.commentedVideos?.items ||
                mypageData.commentedVideos.items.length === 0) && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  댓글을 단 영상이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Mypage;
