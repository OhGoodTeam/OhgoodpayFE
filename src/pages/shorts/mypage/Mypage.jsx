import { useNavigate } from "react-router-dom";
import useMypageData from "../../../features/shorts/hooks/mypage/useMypageData";

// 분리된 컴포넌트들 import
import LoadingErrorWrapper from "../../../features/shorts/component/mypage/LoadingErrorWrapper";
import ProfileSection from "../../../features/shorts/component/mypage/ProfileSection";
import SectionHeader from "../../../features/shorts/component/mypage/SectionHeader";
import HorizontalScrollList from "../../../features/shorts/component/mypage/HorizontalScrollList";
import SubscriptionItem from "../../../features/shorts/component/mypage/SubscriptionItem";
import VideoItem from "../../../features/shorts/component/mypage/VideoItem";

const Mypage = () => {
  const navigate = useNavigate();

  // 커스텀 훅 사용 (JWT 토큰에서 자동으로 사용자 ID 추출)
  const { mypageData, loading, error } = useMypageData();

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

  const handleVideoClick = (videoId) => {
    navigate(`/shorts/feeds?shortsId=${videoId}`);
  };

  // 댓글 단 영상 중복 제거 함수
  const getUniqueCommentedVideos = (videos) => {
    if (!videos || videos.length === 0) return [];
    
    const uniqueVideos = [];
    const seenVideoIds = new Set();

    // videoId 기준으로 중복 제거 (같은 영상에 여러 댓글을 달아도 하나만 표시)
    videos.forEach((video) => {
      if (video.videoId && !seenVideoIds.has(video.videoId)) {
        seenVideoIds.add(video.videoId);
        uniqueVideos.push(video);
      }
    });

    return uniqueVideos;
  };

  // 구독 아이템 렌더링
  const renderSubscriptionItem = (item, index, key) => (
    <SubscriptionItem key={key} item={item} isHorizontal={true} />
  );

  // 비디오 아이템 렌더링
  const renderVideoItem = (item, index, key) => (
    <VideoItem
      key={key}
      item={item}
      onClick={handleVideoClick}
      showStats={false}
      showComment={false}
    />
  );

  return (
    <LoadingErrorWrapper
      loading={loading}
      error={error}
      loadingMessage="로딩 중..."
      errorMessage="오류가 발생했습니다"
    >
      {/* 메인 컨텐츠 */}
      <main className="mypage-main">
        <div className="mypage-container">
          {/* ProfileSection 컴포넌트 */}
          <ProfileSection
            username={mypageData?.header?.displayName || "사용자"}
            avatarUrl={mypageData?.header?.avatarUrl}
            userId={mypageData?.header?.userId}
          />

          {/* 구독 섹션 */}
          <div className="subscription-section">
            <h3 className="section-title">구독</h3>
            <HorizontalScrollList
              items={mypageData?.subscriptions?.items || []}
              renderItem={renderSubscriptionItem}
              onViewAll={() => handleViewAll("subscribe")}
              viewAllText="전체"
              showViewAll={true}
              listStyle={{ minHeight: "80px" }}
            />
          </div>

          {/* 좋아요 표시한 영상 섹션 */}
          <div className="liked-videos-section">
            <SectionHeader
              title="좋아요 표시한 영상"
              onViewAll={() => handleViewAll("liked")}
              showViewAll={true}
              viewAllText="모두 보기"
            />
            <HorizontalScrollList
              items={mypageData?.likedVideos?.items?.slice(0, 5) || []}
              renderItem={renderVideoItem}
              showViewAll={false}
              listStyle={{ minHeight: "200px" }}
            />
          </div>

          {/* 댓글 단 영상 섹션 */}
          <div className="commented-videos-section">
            <SectionHeader
              title="댓글 단 영상"
              onViewAll={() => handleViewAll("commented")}
              showViewAll={true}
              viewAllText="모두 보기"
            />
            <HorizontalScrollList
              items={getUniqueCommentedVideos(mypageData?.commentedVideos?.items)?.slice(0, 5) || []}
              renderItem={renderVideoItem}
              showViewAll={false}
              listStyle={{ minHeight: "200px" }}
            />
            {(!mypageData?.commentedVideos?.items ||
              getUniqueCommentedVideos(mypageData.commentedVideos.items).length === 0) && (
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
      </main>
    </LoadingErrorWrapper>
  );
};

export default Mypage;
