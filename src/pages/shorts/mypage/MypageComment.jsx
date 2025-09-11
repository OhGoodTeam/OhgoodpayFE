import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../shared/api/axiosInstance";

const MypageComment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [commentedVideos, setCommentedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  // URL에서 userId 가져오기 (기본값 1)
  const userId = searchParams.get("userId") || 1;

  useEffect(() => {
    const fetchCommentedVideos = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/mypage/comments", {
          params: { userId, limit: 20 },
        });
        console.log("댓글 영상 목록:", response.data);
        setCommentedVideos(response.data.items || []);
        setHasNext(response.data.hasNext || false);
        setNextCursor(response.data.nextCursor);
      } catch (err) {
        console.error("댓글 영상 목록 로드 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentedVideos();
  }, [userId]);

  if (loading) {
    return (
      <main className="liked-videos-main">
        <div className="liked-videos-container">
          <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="liked-videos-main">
        <div className="liked-videos-container">
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
          .liked-videos-list::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* 메인 컨텐츠 */}
      <main className="liked-videos-main">
        <div className="liked-videos-container">
          {/* 페이지 제목 */}
          <h1 className="page-title">댓글 단 영상</h1>

          {/* 영상 목록 */}
          <div
            className="liked-videos-list"
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {commentedVideos.map((item, index) => (
              <div
                key={`${item.videoId}-${index}`}
                className="shorts-video-item"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/shorts/feed?shortsId=${item.videoId}`)
                }
              >
                <div className="video-thumbnail">
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
                    <i className="fas fa-play" />
                  )}
                </div>
                <div className="video-info">
                  <h3 className="video-title">{item.title}</h3>
                  <p className="video-description">{item.content}</p>
                  {item.context && (
                    <p
                      className="comment-context"
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginTop: "5px",
                      }}
                    >
                      내 댓글: {item.context}
                    </p>
                  )}
                  <div className="video-stats">
                    <div className="stat-item">
                      <i className="fas fa-thumbs-up" />
                      <span>{item.likeCount}</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-comment" />
                      <span>{item.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {commentedVideos.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                댓글을 단 영상이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default MypageComment;
