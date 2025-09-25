import { useSearchParams, useNavigate } from "react-router-dom";
import useInfiniteScroll from "../../../features/shorts/hooks/mypage/useInfiniteScroll";

// 분리된 컴포넌트들 import
import LoadingErrorWrapper from "../../../features/shorts/component/mypage/LoadingErrorWrapper";
import InfiniteScrollContainer from "../../../features/shorts/component/mypage/InfiniteScrollContainer";

const MypageComment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 영상 ID 기준으로 중복 제거하는 데이터 가공 함수
  const processCommentData = (items) => {
    const uniqueVideos = [];
    const seenVideoIds = new Set();

    (items || []).forEach((item) => {
      if (!seenVideoIds.has(item.videoId)) {
        seenVideoIds.add(item.videoId);
        uniqueVideos.push(item);
      }
    });

    return uniqueVideos;
  };

  // 커스텀 훅 사용 (JWT 토큰에서 자동으로 사용자 ID 추출)
  const {
    data: commentedVideos,
    loading,
    loadingMore,
    error,
    hasNext,
    loadMore,
  } = useInfiniteScroll("/api/shorts/mypage/comments", {
    limit: 8,
    processData: processCommentData,
  });

  const handleVideoClick = (videoId) => {
    navigate(`/shorts/feeds?shortsId=${videoId}`);
  };

  // 댓글 비디오 아이템 렌더링
  const renderCommentVideoItem = (item, index, key) => (
    <div
      key={key}
      className="shorts-video-item"
      style={{ cursor: "pointer" }}
      onClick={() => handleVideoClick(item.videoId)}
    >
      <div className="video-thumbnail">
        {item.thumbnailUrl ? (
          <img
            src={`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${item.thumbnailUrl}`}
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
          <p className="comment-context">내 댓글: {item.context}</p>
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
  );

  return (
    <LoadingErrorWrapper
      loading={loading}
      error={error}
      mainClassName="liked-videos-main"
      containerClassName="liked-videos-container"
    >
      {/* 메인 컨텐츠 */}
      <main className="liked-videos-main">
        <div className="liked-videos-container">
          {/* 페이지 제목 */}
          <h1 className="page-title">댓글 단 영상</h1>

          {/* InfiniteScrollContainer 컴포넌트 */}
          <InfiniteScrollContainer
            items={commentedVideos}
            loading={loading}
            loadingMore={loadingMore}
            hasNext={hasNext}
            onLoadMore={loadMore}
            renderItem={renderCommentVideoItem}
            emptyMessage="댓글을 단 영상이 없습니다"
            loadingMessage="더 많은 영상을 불러오는 중..."
            noMoreMessage="모든 댓글 영상을 불러왔습니다"
            scrollMessage="스크롤하여 더 많은 영상 보기"
            itemKey="videoId"
          />
        </div>
      </main>
    </LoadingErrorWrapper>
  );
};

export default MypageComment;
