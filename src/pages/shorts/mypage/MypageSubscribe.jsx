import { useSearchParams } from "react-router-dom";
import useInfiniteScroll from "../../../features/shorts/hooks/mypage/useInfiniteScroll";
import useSubscription from "../../../features/shorts/hooks/mypage/useSubscription";

// 분리된 컴포넌트들 import
import LoadingErrorWrapper from "../../../features/shorts/component/mypage/LoadingErrorWrapper";
import InfiniteScrollContainer from "../../../features/shorts/component/mypage/InfiniteScrollContainer";
import SubscriptionItem from "../../../features/shorts/component/mypage/SubscriptionItem";

const MypageSubscribe = () => {
  const [searchParams] = useSearchParams();

  // 커스텀 훅들 사용 (JWT 토큰에서 자동으로 사용자 ID 추출)
  const {
    data: subscriptions,
    loading,
    loadingMore,
    error,
    hasNext,
    loadMore,
    setData,
  } = useInfiniteScroll("/api/shorts/mypage/subscribe", {
    limit: 8,
  });

  const { unsubscribe } = useSubscription();

  const handleUnsubscribe = async (targetId) => {
    const success = await unsubscribe(targetId, (removedTargetId) => {
      // 구독 목록에서 해당 사용자 제거
      setData((prev) => prev.filter((item) => item.userId !== removedTargetId));
    });
    console.log("success", success);
  };

  // 구독 아이템 렌더링
  const renderSubscriptionItem = (item, index, key) => (
    <SubscriptionItem
      key={key}
      item={item}
      onUnsubscribe={handleUnsubscribe}
      showUnsubscribeButton={true}
      isHorizontal={false}
    />
  );

  return (
    <LoadingErrorWrapper
      loading={loading}
      error={error}
      mainClassName="subscribe-main"
      containerClassName="subscribe-container"
    >
      {/* 메인 컨텐츠 */}
      <main className="subscribe-main">
        <div className="subscribe-container">
          {/* InfiniteScrollContainer 컴포넌트 */}
          <InfiniteScrollContainer
            items={subscriptions}
            loading={loading}
            loadingMore={loadingMore}
            hasNext={hasNext}
            onLoadMore={loadMore}
            renderItem={renderSubscriptionItem}
            emptyMessage="구독한 사용자가 없습니다"
            loadingMessage="더 많은 구독자를 불러오는 중..."
            noMoreMessage="모든 구독자를 불러왔습니다"
            scrollMessage="스크롤하여 더 많은 구독자 보기"
            itemKey="userId"
          />
        </div>
      </main>
    </LoadingErrorWrapper>
  );
};

export default MypageSubscribe;
