import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import { useShortsFeeds } from "../../../features/shorts/hooks/feed/useShortsFeeds";
import FeedInteractionWidget from "../../../features/shorts/component/feed/FeedInteractionWidget";
import FeedCommentWidget from "../../../features/shorts/component/feed/FeedCommentWidget";
import "swiper/css";
import "swiper/css/free-mode";

const Feed = () => {
  // Constants
  const PAGE_SIZE = 10;
  const CUSTOMER_ID = 1;

  // State
  const [page, setPage] = useState(1);
  const [currentShortsId, setCurrentShortsId] = useState(null);
  const [currentShortsCommentCount, setCurrentShortsCommentCount] = useState(0);
  const [currentShortsLikeCount, setCurrentShortsLikeCount] = useState(0);
  const [myReaction, setMyReaction] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Refs
  const uploadContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const commentModalRef = useRef(null);
  const navigate = useNavigate();

  // Custom hooks
  const {
    data: feeds,
    error,
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
      const currentFeed = feeds[swiper.activeIndex];
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
    [feeds, loadFromLocalStorage]
  );

  const handleReachEnd = useCallback(
    (swiper) => {
      const totalSlides = feeds.length;
      const currentIndex = swiper.activeIndex;

      if (currentIndex + 1 >= totalSlides - 3 && !isLoadingMore) {
        setPage((prev) => prev + 1);
      }
    },
    [feeds.length, isLoadingMore]
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

  // Loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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
          {feeds.map((item, index) => (
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
                    <div className="profile-pic" />
                    <div className="user-details">
                      <span className="username" style={{ width: "80px" }}>
                        {item.customerNickname}
                      </span>
                      <button className="subscribe-btn">구독</button>
                    </div>
                  </div>
                  <div className="video-description">
                    {item.shortsName}
                    <br />
                    {item.shortsExplain}
                    <br />
                    {item.date}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

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
          currentShortsId={currentShortsId}
          currentShortsCommentCount={currentShortsCommentCount}
          currentShortsLikeCount={currentShortsLikeCount}
          myReaction={myReaction}
          onReactionSuccess={handleReactionSuccess}
        />
      </main>
    </>
  );
};

export default Feed;
