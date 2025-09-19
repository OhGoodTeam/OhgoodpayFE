import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import { useShortsFeeds } from "../../../features/shorts/hooks/feed/useShortsFeeds";
import FeedInteractionWidget from "../../../features/shorts/component/feed/FeedInteractionWidget";
import FeedCommentWidget from "../../../features/shorts/component/feed/FeedCommentWidget";
import PointGauge from "../../../features/shorts/component/feed/PointGauge";
import ShareModal from "../../../features/shorts/component/feed/ShareModal";
import axiosInstance from "../../../shared/api/axiosInstance";
import profileImg from "../../../features/shorts/img/profile.jpeg";
import "swiper/css";
import "swiper/css/free-mode";

const Feed = () => {
  // Constants
  const PAGE_SIZE = 10;
  const CUSTOMER_ID = 1;

  // URL 파라미터 처리
  const [searchParams] = useSearchParams();
  const urlShortsId = searchParams.get("shortsId");

  // State
  const [page, setPage] = useState(1);
  const [currentShortsId, setCurrentShortsId] = useState(null);
  const [currentShortsCommentCount, setCurrentShortsCommentCount] = useState(0);
  const [currentShortsLikeCount, setCurrentShortsLikeCount] = useState(0);
  const [myReaction, setMyReaction] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 특정 영상 데이터 상태
  const [specificVideoData, setSpecificVideoData] = useState(null);
  const [loadingSpecificVideo, setLoadingSpecificVideo] = useState(false);

  // Refs
  const uploadContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const commentModalRef = useRef(null);
  const navigate = useNavigate();
  const [customerId] = useState(1);
  const pointGaugeRef = useRef(null);

  const {
    data: feeds,
    error: feedsError,
    isLoading,
    isLoadingMore,
  } = useShortsFeeds({
    page,
    size: PAGE_SIZE,
    keyword: "",
    customerId: CUSTOMER_ID,
  });

  // Local storage helpers
  const saveToLocalStorage = useCallback((shortsId, reactionData) => {
    if (!shortsId) return;

    localStorage.setItem(
      `reaction_${shortsId}`,
      reactionData.myReaction || "null"
    );

    if (
      typeof reactionData.likeCount === "number" &&
      reactionData.likeCount >= 0
    ) {
      localStorage.setItem(
        `likeCount_${shortsId}`,
        reactionData.likeCount.toString()
      );
    }
  }, []);

  const loadFromLocalStorage = useCallback((shortsId, apiData) => {
    if (!shortsId) return { reaction: null, likeCount: 0 };

    const savedReaction = localStorage.getItem(`reaction_${shortsId}`);
    const savedLikeCount = localStorage.getItem(`likeCount_${shortsId}`);

    const reaction =
      savedReaction && savedReaction !== "null" && savedReaction !== "undefined"
        ? savedReaction
        : apiData?.myReaction || null;

    const likeCount =
      savedLikeCount &&
      savedLikeCount !== "null" &&
      savedLikeCount !== "undefined"
        ? parseInt(savedLikeCount, 10)
        : apiData?.likeCount || 0;

    return { reaction, likeCount };
  }, []);

  // 특정 영상 데이터 가져오기
  const fetchSpecificVideo = useCallback(
    async (shortsId) => {
      try {
        setLoadingSpecificVideo(true);
        const response = await axiosInstance.get(`/shorts/${shortsId}`);
        setSpecificVideoData(response.data);
        setCurrentShortsId(shortsId);
      } catch {
        if (feeds && feeds.length > 0) {
          setCurrentShortsId(feeds[0].shortsId);
        }
      } finally {
        setLoadingSpecificVideo(false);
      }
    },
    [feeds]
  );

  // 특정 영상을 중심으로 피드 데이터 재정렬
  const reorderFeedsAroundTarget = useCallback(
    (targetShortsId) => {
      if (!feeds || feeds.length === 0) {
        return feeds;
      }

      const sortedFeeds = [...feeds].sort((a, b) => a.shortsId - b.shortsId);
      const targetIndex = sortedFeeds.findIndex(
        (feed) => feed.shortsId === targetShortsId
      );

      if (targetIndex === -1) {
        return feeds;
      }

      const reorderedFeeds = [];
      for (let i = targetIndex; i < sortedFeeds.length; i++) {
        reorderedFeeds.push(sortedFeeds[i]);
      }
      for (let i = targetIndex - 1; i >= 0; i--) {
        reorderedFeeds.push(sortedFeeds[i]);
      }

      return reorderedFeeds;
    },
    [feeds]
  );

  // URL 파라미터로 특정 영상 요청
  useEffect(() => {
    if (urlShortsId) {
      fetchSpecificVideo(parseInt(urlShortsId));
    }
  }, [urlShortsId, fetchSpecificVideo]);

  // feeds 로드 후 초기 currentShortsId 설정 또는 특정 영상으로 이동
  useEffect(() => {
    if (feeds && feeds.length > 0) {
      if (urlShortsId && specificVideoData) {
        setCurrentShortsId(parseInt(urlShortsId));
        setTimeout(() => {
          const swiper = document.querySelector(".video-swiper")?.swiper;
          if (swiper) {
            swiper.slideTo(0);
          }
        }, 100);
      } else if (!urlShortsId && !currentShortsId) {
        setCurrentShortsId(feeds[0].shortsId);
      }
    }
  }, [feeds, currentShortsId, urlShortsId, specificVideoData]);

  // Event handlers
  const handleReactionSuccess = useCallback(
    (reactionData) => {
      if (
        typeof reactionData.likeCount === "number" &&
        reactionData.likeCount >= 0
      ) {
        setCurrentShortsLikeCount(reactionData.likeCount);
      }
      setMyReaction(reactionData.myReaction);
      saveToLocalStorage(currentShortsId, reactionData);
    },
    [currentShortsId, saveToLocalStorage]
  );

  const handleUploadClick = useCallback(() => {
    setShowUploadOptions((prev) => !prev);
  }, []);

  const handleCameraClick = useCallback(() => {
    setShowUploadOptions(false);
  }, []);

  const handleGalleryClick = useCallback(() => {
    setShowUploadOptions(false);
    fileInputRef.current?.click();
  }, []);

  const handleCommentClick = useCallback(() => {
    const modal = commentModalRef.current;
    if (modal?.classList.contains("open")) {
      setIsCommentModalOpen(false);
      modal.classList.remove("open");
    } else {
      setIsCommentModalOpen(true);
      modal?.classList.add("open");
    }
  }, []);

  const handleShareClick = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        video.muted = newMuted;
      });
      return newMuted;
    });
  }, []);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith("video/")) {
        if (file) alert("비디오 파일만 선택해주세요.");
        return;
      }

      const videoUrl = URL.createObjectURL(file);
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: videoUrl,
        lastModified: file.lastModified,
      };

      sessionStorage.setItem("selectedFile", JSON.stringify(fileData));
      window.tempSelectedFile = file;
      navigate("/shorts/upload");
    },
    [navigate]
  );

  const handleVideoClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    const video = event.target;
    const icon = video.parentElement?.querySelector("i");
    if (!video || !icon) return;

    if (video.paused) {
      // 다른 모든 비디오 정지
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((otherVideo) => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
          const otherIcon = otherVideo.parentElement?.querySelector("i");
          if (otherIcon) {
            otherIcon.classList.add("fa-play");
            otherIcon.classList.remove("fa-pause");
          }
        }
      });

      video
        .play()
        .then(() => {
          icon.classList.add("fa-pause");
          icon.classList.remove("fa-play");
        })
        .catch(console.error);
    } else {
      video.pause();
      icon.classList.add("fa-play");
      icon.classList.remove("fa-pause");
    }
  }, []);

  // Slide change handler
  const handleSlideChange = useCallback(
    (swiper) => {
      const currentFeeds =
        urlShortsId && specificVideoData
          ? reorderFeedsAroundTarget(parseInt(urlShortsId))
          : feeds;
      const currentFeed = currentFeeds[swiper.activeIndex];
      const shortsId = currentFeed?.shortsId;

      setCurrentShortsId(shortsId);
      setCurrentShortsCommentCount(currentFeed?.commentCount || 0);

      if (shortsId) {
        const { reaction, likeCount } = loadFromLocalStorage(
          shortsId,
          currentFeed
        );
        setMyReaction(reaction);
        setCurrentShortsLikeCount(likeCount);
      } else {
        setMyReaction(null);
        setCurrentShortsLikeCount(0);
      }

      // 모든 비디오 일시정지
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((video) => {
        if (!video.paused) {
          video.pause();
          const icon = video.parentElement?.querySelector("i");
          if (icon) {
            icon.classList.add("fa-play");
            icon.classList.remove("fa-pause");
          }
        }
      });

      // 현재 비디오 재생
      const currentVideoElement = document.querySelector(
        `video[data-index="${swiper.activeIndex}"]`
      );
      if (currentVideoElement && currentVideoElement.readyState >= 2) {
        currentVideoElement.currentTime = 0;
        setTimeout(() => {
          currentVideoElement
            .play()
            .then(() => {
              const icon =
                currentVideoElement.parentElement?.querySelector("i");
              if (icon) {
                icon.classList.add("fa-pause");
                icon.classList.remove("fa-play");
              }
            })
            .catch(console.error);
        }, 100);
      }
    },
    [
      feeds,
      loadFromLocalStorage,
      urlShortsId,
      specificVideoData,
      reorderFeedsAroundTarget,
    ]
  );

  const handleReachEnd = useCallback(
    (swiper) => {
      const currentFeeds =
        urlShortsId && specificVideoData
          ? reorderFeedsAroundTarget(parseInt(urlShortsId))
          : feeds;
      const totalSlides = currentFeeds.length;
      const currentIndex = swiper.activeIndex;

      if (
        !urlShortsId &&
        currentIndex + 1 >= totalSlides - 3 &&
        !isLoadingMore
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [
      feeds,
      isLoadingMore,
      urlShortsId,
      specificVideoData,
      reorderFeedsAroundTarget,
    ]
  );

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        uploadContainerRef.current &&
        !uploadContainerRef.current.contains(event.target)
      ) {
        setShowUploadOptions(false);
      }
    };

    if (showUploadOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUploadOptions]);

  // 비디오 재생 상태 추적 및 포인트 업데이트
  useEffect(() => {
    const currentFeeds =
      urlShortsId && specificVideoData
        ? reorderFeedsAroundTarget(parseInt(urlShortsId))
        : feeds;

    const interval = setInterval(() => {
      if (!currentShortsId || !currentFeeds.length) {
        return;
      }

      const videoIndex = currentFeeds.findIndex(
        (feed) => feed.shortsId === currentShortsId
      );

      const currentVideo = document.querySelector(
        `video[data-index="${videoIndex}"]`
      );

      if (currentVideo && pointGaugeRef.current) {
        const isPlaying = !currentVideo.paused;
        const playbackPos = currentVideo.currentTime;
        pointGaugeRef.current.updateWatchTime(
          currentShortsId,
          isPlaying,
          playbackPos
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    currentShortsId,
    feeds,
    urlShortsId,
    specificVideoData,
    reorderFeedsAroundTarget,
  ]);

  // 특정 영상 로딩 중 (일반 피드도 함께 로딩)
  if (loadingSpecificVideo && isLoading) {
    return <div>영상을 불러오는 중...</div>;
  }

  // 일반 피드 로딩 중
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (feedsError) {
    return <div>Error: {feedsError.message}</div>;
  }

  return (
    <>
      <input
        type="file"
        id="fileInput"
        accept="video/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <main className="main-content">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          allowTouchMove={true}
          resistanceRatio={0.85}
          threshold={50}
          className="video-swiper"
          keyboard={{ enabled: true, pageUpDown: true }}
          mousewheel={{ enabled: true, forceToAxis: true }}
          modules={[FreeMode, Keyboard, Mousewheel]}
          touchRatio={1}
          touchAngle={45}
          grabCursor={true}
          onSlideChange={handleSlideChange}
          onReachEnd={handleReachEnd}
        >
          {(urlShortsId && specificVideoData
            ? reorderFeedsAroundTarget(parseInt(urlShortsId))
            : feeds
          ).map((item, index) => (
            <SwiperSlide
              key={`${item.shortsId}-${index}`}
              data-shorts-id={item.shortsId}
            >
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="video-player">
                    <video
                      data-index={index}
                      style={{ width: "100%", height: "100%" }}
                      src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.videoName}`}
                      muted={isMuted}
                      loop
                      onClick={handleVideoClick}
                      onLoadedData={(e) => {
                        if (index === 0) {
                          const allVideos = document.querySelectorAll("video");
                          allVideos.forEach((video) => {
                            if (!video.paused) video.pause();
                          });
                          e.target.play();
                          const icon =
                            e.target.parentElement?.querySelector("i");
                          if (icon) {
                            icon.classList.add("fa-pause");
                            icon.classList.remove("fa-play");
                          }
                        }
                      }}
                      onPlay={(e) => {
                        const icon = e.target.parentElement?.querySelector("i");
                        if (icon) {
                          icon.classList.add("fa-pause");
                          icon.classList.remove("fa-play");
                        }
                      }}
                      onPause={(e) => {
                        const icon = e.target.parentElement?.querySelector("i");
                        if (icon) {
                          icon.classList.add("fa-play");
                          icon.classList.remove("fa-pause");
                        }
                      }}
                    />
                    <i
                      className="fas fa-play"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "48px",
                        color: "rgba(255, 255, 255, 0.8)",
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMuteToggle();
                      }}
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "rgba(0, 0, 0, 0.5)",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 15,
                      }}
                    >
                      <i
                        className={
                          isMuted ? "fas fa-volume-mute" : "fas fa-volume-up"
                        }
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </button>
                  </div>
                </div>

                <div className="video-info">
                  <div className="user-info">
                    <div
                      className="profile-pic"
                      style={{
                        backgroundImage: `url(${profileImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="user-details">
                      <span className="username" style={{ width: "80px" }}>
                        {item.customerNickname || item.nickname}
                      </span>
                      <button className="subscribe-btn">구독</button>
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 전역 포인트 게이지 */}
        <PointGauge ref={pointGaugeRef} customerId={customerId} />

        <FeedCommentWidget
          commentModalRef={commentModalRef}
          handleCommentClick={handleCommentClick}
          shortsId={currentShortsId}
          isCommentModalOpen={isCommentModalOpen}
        />

        <FeedInteractionWidget
          handleUploadClick={handleUploadClick}
          handleCameraClick={handleCameraClick}
          handleGalleryClick={handleGalleryClick}
          uploadContainerRef={uploadContainerRef}
          showUploadOptions={showUploadOptions}
          handleCommentClick={handleCommentClick}
          handleShareClick={handleShareClick}
          currentShortsId={currentShortsId}
          currentShortsCommentCount={currentShortsCommentCount}
          currentShortsLikeCount={currentShortsLikeCount}
          myReaction={myReaction}
          onReactionSuccess={handleReactionSuccess}
        />

        {/* 공유 모달 */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={handleCloseShareModal}
          shortsId={currentShortsId}
        />
      </main>
    </>
  );
};

export default Feed;
