import { useProfile } from "../../../features/shorts/hooks/profile/useProfile";
import { useEffect, useRef, useState } from "react";
import VideoItem from "../../../features/shorts/component/profile/VideoItem";
import SortButton from "../../../features/shorts/component/profile/SortButton";
import EmptyShortsList from "../../../features/shorts/component/profile/EmptyShortsList";
import { useSearchParams } from "react-router-dom";
import { useCreateSubscription } from "../../../features/shorts/hooks/profile/useCreateSubscription";
import SubscribeButton from "../../../features/shorts/component/profile/SubscribeButton";
import useSubscription from "../../../features/shorts/hooks/mypage/useSubscription";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [page, setPage] = useState(0);
  const [allShorts, setAllShorts] = useState([]); // 모든 영상 목록
  const [hasNext, setHasNext] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [searchParams] = useSearchParams();

  const targetId = searchParams.get("targetId");
  const navigate = useNavigate();

  const sortOption = [
    { label: "최신순", value: "latest" },
    { label: "인기순", value: "like" },
    { label: "날짜순", value: "oldest" },
  ];

  const {
    data: profileData,
    error,
    loading,
    refetch,
  } = useProfile({
    page,
    targetId,
    sortBy,
  });

  const { createSubscription } = useCreateSubscription();
  const { unsubscribe } = useSubscription();

  // 정렬 변경 시 상태 초기화
  useEffect(() => {
    console.log("sortBy changed:", sortBy);
    setPage(0);
    setAllShorts([]);
    setHasNext(false);
  }, [sortBy]);

  console.log("Current page:", page);
  console.log("Current sortBy:", sortBy);
  console.log("profileData:", profileData);

  // 새 데이터 들어오면 처리
  useEffect(() => {
    if (profileData?.shortsList) {
      if (page === 0) {
        // 첫 페이지면 기존 데이터 교체
        setAllShorts(profileData.shortsList);
      } else {
        // 추가 페이지면 중복 제거하고 기존 데이터에 추가
        setAllShorts((prev) => {
          const newItems = profileData.shortsList.filter(
            (item) =>
              !prev.some((prevItem) => prevItem.shortsId === item.shortsId)
          );
          return [...prev, ...newItems];
        });
      }
      setHasNext(profileData.hasNext);
    }
  }, [profileData, page]);

  const observerRef = useRef(null);

  // 무한스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNext, loading]);

  //  구독하기
  const handleSubscribe = async () => {
    try {
      const response = await createSubscription({
        targetId: targetId,
      });
      if (response.code === 200) {
        console.log("구독 성공, 프로필 새로고침 시작");
        await refetch();
      }
      console.log("response", response);
    } catch (error) {
      console.error("error", error);
    }
  };

  // 구독 취소
  const handleUnsubscribe = async () => {
    try {
      const response = await unsubscribe(targetId);
      console.log("response", response);
      if (response) {
        await refetch();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  //  쇼츠 상세
  const handleVideoClick = (shortsId) => {
    navigate(`/shorts/feeds?shortsId=${shortsId}`);
  };

  if (loading && page === 0) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!profileData) {
    return <div>No data</div>;
  }

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="profile-main">
        <div className="profile-container">
          {/* 프로필 섹션 */}
          <div className="profile-section-container">
            <div className="profile-section">
              {profileData?.profileImg ? (
                <div
                  className="profile-image"
                  style={{
                    backgroundImage: `url(${`https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/${profileData.profileImg}`})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="profile-image">
                  <i className="fas fa-user" />
                </div>
              )}

              <div className="profile-info">
                <h1 className="channel-name">
                  {profileData?.customerNickname}
                </h1>
                <p className="channel-greeting">{profileData.introduce}</p>
                <div className="channel-stats">
                  <span className="subscriber-count">
                    구독자 {profileData.subscriberCount}명
                  </span>
                  <span className="video-count">
                    동영상 {profileData.videoCount}개
                  </span>
                </div>
              </div>
            </div>

            {(() => {
              switch (profileData.isSubscribed) {
                case "SELF":
                  return (
                    <div style={{ display: "flex", gap: "10px" }}>
                      {/* <SubscribeButton
                        value="동영상 관리"
                        onClick={() => {
                          navigate(`/shorts/profile/all?targetId=${targetId}`);
                        }}
                        option="flex"
                      /> */}
                      <SubscribeButton
                        value="프로필 편집"
                        onClick={() => {
                          navigate(`/shorts/profile/edit`, {
                            state: { profileData },
                          });
                        }}
                        option="flex"
                      />
                    </div>
                  );
                case "SUBSCRIBED":
                  return (
                    <SubscribeButton
                      value="구독 취소"
                      onClick={handleUnsubscribe}
                    />
                  );
                case "NOT_SUBSCRIBED":
                  return (
                    <SubscribeButton value="구독" onClick={handleSubscribe} />
                  );
              }
            })()}
          </div>
          {/* 정렬 옵션 */}
          {allShorts.length > 0 && (
            <div className="sort-options">
              {sortOption.map((item) => (
                <SortButton
                  key={item.value}
                  item={item}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              ))}
            </div>
          )}

          {/* 영상 그리드 또는 빈 상태 */}
          {allShorts.length === 0 ? (
            <EmptyShortsList />
          ) : (
            <div className="video-grid">
              {allShorts.map((item) => (
                <VideoItem
                  key={item.shortsId}
                  item={item}
                  onClick={handleVideoClick}
                />
              ))}
            </div>
          )}

          {/* 무한 스크롤 트리거 */}
          {hasNext && (
            <div className="load-more-trigger" ref={observerRef}>
              <div className="loading-spinner">로딩 중...</div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
export default Profile;
