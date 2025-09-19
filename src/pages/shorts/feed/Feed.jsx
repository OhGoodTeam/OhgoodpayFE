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

  // 비디오 컨트롤 상태
  const [showVideoControls, setShowVideoControls] = useState(true);
  const [mouseTimeoutId, setMouseTimeoutId] = useState(null);

  // 특정 영상 데이터 상태
  const [specificVideoData, setSpecificVideoData] = useState(null);
  const [loadingSpecificVideo, setLoadingSpecificVideo] = useState(false);

  // 동적 피드 데이터 (특정 영상 모드용)
  const [dynamicFeeds, setDynamicFeeds] = useState([]);
  const [loadingDynamicVideo, setLoadingDynamicVideo] = useState(false);
  const [dynamicPage, setDynamicPage] = useState(1);
  const [loadingMoreDynamic, setLoadingMoreDynamic] = useState(false);

  // URL 파라미터가 있을 때의 로딩 상태
  const isUrlModeLoading = urlShortsId && loadingSpecificVideo;

  // URL 파라미터 모드에서 스크롤 상태 추적
  const [hasScrolledDown, setHasScrolledDown] = useState(false);

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
    enabled: !urlShortsId, // URL 파라미터가 없을 때만 실행
  });

  // URL 파라미터가 있을 때는 빈 배열로 초기화
  const currentFeeds = urlShortsId
    ? dynamicFeeds.length > 0
      ? dynamicFeeds
      : []
    : feeds;

  // 디버깅용 로그
  console.log("현재 상태:", {
    urlShortsId,
    feedsLength: feeds?.length || 0,
    dynamicFeedsLength: dynamicFeeds?.length || 0,
    currentFeedsLength: currentFeeds?.length || 0,
    isLoading,
    loadingSpecificVideo,
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

  // URL 파라미터 모드에서 추가 영상 로드 (순환을 위해)
  const loadMoreVideosForUrlMode = useCallback(async () => {
    if (loadingMoreDynamic) return;

    try {
      setLoadingMoreDynamic(true);
      console.log("URL 모드에서 순환을 위한 추가 영상 로드:", dynamicPage + 1);
      console.log("현재 dynamicFeeds 길이:", dynamicFeeds.length);

      const response = await axiosInstance.get("/shorts/feeds", {
        params: {
          page: dynamicPage + 1,
          size: PAGE_SIZE,
          keyword: "",
          customerId: CUSTOMER_ID,
        },
      });

      const newData = response.data.data;
      console.log("새로 가져온 데이터:", newData?.length || 0, "개");

      if (newData && newData.length > 0) {
        // 중복 제거하면서 추가
        const existingIds = new Set(dynamicFeeds.map((item) => item.shortsId));
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.shortsId)
        );

        console.log("중복 제거 후 추가할 데이터:", uniqueNewData.length, "개");
        console.log(
          "새로 추가될 shortsId들:",
          uniqueNewData.map((item) => item.shortsId)
        );

        if (uniqueNewData.length > 0) {
          setDynamicFeeds((prev) => {
            const updated = [...prev, ...uniqueNewData];
            console.log("업데이트된 dynamicFeeds 길이:", updated.length);
            console.log(
              "업데이트된 dynamicFeeds의 shortsId들:",
              updated.map((item) => item.shortsId)
            );
            return updated;
          });
          setDynamicPage((prev) => prev + 1);
          console.log(
            "순환을 위한 추가 영상 로드 완료:",
            uniqueNewData.length,
            "개"
          );
        } else {
          console.log("추가할 새로운 데이터가 없음 (모두 중복)");
          // 중복이어도 페이지는 증가시켜야 함
          setDynamicPage((prev) => prev + 1);
        }
      } else {
        console.log("더 이상 로드할 데이터가 없음 - 순환 완료");
        // 더 이상 데이터가 없으면 순환을 위해 처음부터 다시 시작
        setDynamicPage(1);
      }
    } catch (error) {
      console.error("순환을 위한 추가 영상 로드 실패:", error);
    } finally {
      setLoadingMoreDynamic(false);
    }
  }, [dynamicPage, dynamicFeeds, loadingMoreDynamic]);

  // 특정 영상과 주변 영상들 가져오기
  const fetchSpecificVideoWithContext = useCallback(
    async (shortsId) => {
      try {
        setLoadingSpecificVideo(true);
        console.log("특정 영상과 주변 영상들 로드 시작:", shortsId);

        // dynamicPage 초기화
        setDynamicPage(1);

        // 1. 일반 피드 데이터 가져오기 (여러 페이지)
        const allFeeds = [];
        let page = 1;
        let hasMore = true;
        let targetVideoFound = false;

        while (hasMore && page <= 50) {
          // 최대 50페이지까지 로드 (더 많은 영상 확보)
          try {
            const response = await axiosInstance.get("/shorts/feeds", {
              params: {
                page,
                size: PAGE_SIZE,
                keyword: "",
                customerId: CUSTOMER_ID,
              },
            });

            const pageData = response.data.data;
            if (pageData && pageData.length > 0) {
              allFeeds.push(...pageData);

              // 타겟 영상이 이 페이지에 있는지 확인
              if (!targetVideoFound) {
                const targetIndex = pageData.findIndex(
                  (video) => video.shortsId === shortsId
                );
                if (targetIndex !== -1) {
                  targetVideoFound = true;
                  console.log(
                    `타겟 영상 발견: 페이지 ${page}, 인덱스 ${targetIndex}`
                  );
                }
              }
            } else {
              hasMore = false;
            }
            page++;
          } catch (error) {
            console.error(`페이지 ${page} 로드 실패:`, error);
            hasMore = false;
          }
        }

        if (targetVideoFound) {
          // 2. 타겟 영상을 중심으로 피드 재정렬 (아래로만 스크롤, 순환)
          const targetIndex = allFeeds.findIndex(
            (video) => video.shortsId === shortsId
          );
          if (targetIndex !== -1) {
            // 타겟 영상보다 큰 shortsId들을 오름차순으로 정렬 (15, 16, 17, ...)
            const afterTarget = allFeeds
              .filter((video) => video.shortsId > shortsId)
              .sort((a, b) => a.shortsId - b.shortsId); // 작은 수부터 큰 수 순서

            // 타겟 영상보다 작은 shortsId들을 오름차순으로 정렬 (1, 2, 3, ...)
            const beforeTarget = allFeeds
              .filter((video) => video.shortsId < shortsId)
              .sort((a, b) => a.shortsId - b.shortsId); // 작은 수부터 큰 수 순서

            const reorderedFeeds = [
              allFeeds[targetIndex], // 14 (타겟 영상)
              ...afterTarget, // 15, 16, 17, 18, ...
              ...beforeTarget, // 1, 2, 3, 4, ..., 12, 13
            ];

            console.log("재정렬된 피드:", reorderedFeeds.length, "개 영상");
            console.log("타겟 영상:", allFeeds[targetIndex].shortsId);
            console.log(
              "타겟 영상 이후:",
              afterTarget.map((v) => v.shortsId)
            );
            console.log(
              "순환 영상들:",
              beforeTarget.map((v) => v.shortsId)
            );

            setDynamicFeeds(reorderedFeeds);
            setCurrentShortsId(shortsId);
            setSpecificVideoData(allFeeds[targetIndex]);
            setDynamicPage(page); // 현재 로드된 페이지로 설정
          } else {
            throw new Error("타겟 영상을 찾을 수 없습니다.");
          }
        } else {
          // 타겟 영상이 일반 피드에 없으면 개별 API로 시도
          console.log("일반 피드에서 타겟 영상을 찾을 수 없음, 개별 API 시도");
          const response = await axiosInstance.get(`/shorts/${shortsId}`);
          const targetVideo = response.data;
          setDynamicFeeds([targetVideo]);
          setCurrentShortsId(shortsId);
          setSpecificVideoData(targetVideo);
          setDynamicPage(1); // 개별 API 사용 시 페이지 1로 설정
        }
      } catch (error) {
        console.error("특정 영상 로드 실패:", error);
        // 에러 시 일반 피드로 이동
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
      console.log("URL에서 shortsId 감지:", urlShortsId);
      setHasScrolledDown(false); // 새로운 URL 파라미터로 접속 시 스크롤 상태 초기화
      fetchSpecificVideoWithContext(parseInt(urlShortsId));
    }
  }, [urlShortsId, fetchSpecificVideoWithContext]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (mouseTimeoutId) {
        clearTimeout(mouseTimeoutId);
      }
    };
  }, [mouseTimeoutId]);

  // feeds 로드 후 초기 currentShortsId 설정 또는 특정 영상으로 이동
  useEffect(() => {
    if (feeds && feeds.length > 0) {
      if (urlShortsId && dynamicFeeds.length > 0) {
        console.log("특정 영상으로 이동:", urlShortsId, dynamicFeeds);
        setCurrentShortsId(parseInt(urlShortsId));

        // 타겟 영상의 인덱스 찾기 (재정렬된 피드에서)
        const targetIndex = dynamicFeeds.findIndex(
          (video) => video.shortsId === parseInt(urlShortsId)
        );

        if (targetIndex !== -1) {
          console.log("타겟 영상 인덱스:", targetIndex);
          // Swiper가 렌더링된 후 타겟 영상 위치로 이동
          setTimeout(() => {
            const swiper = document.querySelector(".video-swiper")?.swiper;
            if (swiper) {
              console.log(`Swiper ${targetIndex}번째 슬라이드로 이동`);
              swiper.slideTo(targetIndex, 0); // 0ms로 즉시 이동
            }
          }, 200);
        }
      } else if (!urlShortsId && !currentShortsId) {
        setCurrentShortsId(feeds[0].shortsId);
      }
    }
  }, [feeds, currentShortsId, urlShortsId, dynamicFeeds]);

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

  // 비디오 컨트롤 마우스 이벤트 핸들러
  const handleVideoMouseEnter = useCallback(() => {
    setShowVideoControls(true);
    // 기존 타이머가 있다면 취소
    if (mouseTimeoutId) {
      clearTimeout(mouseTimeoutId);
      setMouseTimeoutId(null);
    }
  }, [mouseTimeoutId]);

  const handleVideoMouseLeave = useCallback(() => {
    // 3초 후에 컨트롤 숨기기
    const timeoutId = setTimeout(() => {
      setShowVideoControls(false);
    }, 3000);
    setMouseTimeoutId(timeoutId);
  }, []);

  const handleVideoMouseMove = useCallback(() => {
    setShowVideoControls(true);
    // 기존 타이머가 있다면 취소
    if (mouseTimeoutId) {
      clearTimeout(mouseTimeoutId);
      setMouseTimeoutId(null);
    }
    // 3초 후에 컨트롤 숨기기
    const timeoutId = setTimeout(() => {
      setShowVideoControls(false);
    }, 3000);
    setMouseTimeoutId(timeoutId);
  }, [mouseTimeoutId]);

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

  const handleVideoClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const video = event.target;
      const icon = video.parentElement?.querySelector("i");
      if (!video || !icon) return;

      // 비디오 클릭 시 컨트롤 표시
      setShowVideoControls(true);
      if (mouseTimeoutId) {
        clearTimeout(mouseTimeoutId);
        setMouseTimeoutId(null);
      }

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
    },
    [mouseTimeoutId]
  );

  // Slide change handler
  const handleSlideChange = useCallback(
    (swiper) => {
      const currentFeed = currentFeeds[swiper.activeIndex];
      const shortsId = currentFeed?.shortsId;

      // 영상이 변경되었을 때 포인트 게이지 직접 초기화
      if (currentShortsId !== shortsId && pointGaugeRef.current && shortsId) {
        console.log(
          "영상 변경 감지 - 포인트 게이지 초기화:",
          currentShortsId,
          "→",
          shortsId
        );

        // 영상 길이 정보 가져오기 - 현재 슬라이드 인덱스 사용
        setTimeout(() => {
          const currentVideo = document.querySelector(
            `video[data-index="${swiper.activeIndex}"]`
          );
          const videoDuration = currentVideo?.duration || 10; // 기본값 10초

          // 포인트 게이지 초기화 및 재설정
          pointGaugeRef.current.resetVideoGauge(shortsId);
          pointGaugeRef.current.updateWatchTime(shortsId, false, videoDuration);
        }, 100);
      }

      setCurrentShortsId(shortsId);
      setCurrentShortsCommentCount(currentFeed?.commentCount || 0);

      // URL 파라미터 모드에서 스크롤 상태 추적
      if (urlShortsId) {
        const targetIndex = dynamicFeeds.findIndex(
          (video) => video.shortsId === parseInt(urlShortsId)
        );
        if (targetIndex !== -1 && swiper.activeIndex > targetIndex) {
          setHasScrolledDown(true);
          console.log("아래로 스크롤됨 - 위로 스크롤 허용");
        }
      }

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
    [currentFeeds, loadFromLocalStorage, urlShortsId, dynamicFeeds]
  );

  const handleReachEnd = useCallback(
    (swiper) => {
      const totalSlides = currentFeeds.length;
      const currentIndex = swiper.activeIndex;

      if (
        currentIndex + 1 >= totalSlides - 3 &&
        !isLoadingMore &&
        !loadingMoreDynamic
      ) {
        if (urlShortsId) {
          // URL 파라미터 모드: 순환을 위해 추가 영상 로드
          console.log("URL 모드에서 순환을 위한 추가 영상 로드");
          loadMoreVideosForUrlMode();
        } else {
          // 일반 모드: 기존 무한 스크롤
          setPage((prev) => prev + 1);
        }
      }
    },
    [
      currentFeeds,
      isLoadingMore,
      loadingMoreDynamic,
      urlShortsId,
      loadMoreVideosForUrlMode,
    ]
  );

  // URL 파라미터 모드에서 위로 스크롤 시 처리
  const handleReachBeginning = useCallback(
    (swiper) => {
      if (urlShortsId && !hasScrolledDown) {
        console.log(
          "URL 모드에서 위로 스크롤 시도 - 차단 (아직 아래로 스크롤 안함)"
        );
        // 위로 스크롤을 막기 위해 타겟 슬라이드로 강제 이동
        const targetIndex = dynamicFeeds.findIndex(
          (video) => video.shortsId === parseInt(urlShortsId)
        );
        if (targetIndex !== -1) {
          swiper.slideTo(targetIndex, 0);
        }
      } else if (urlShortsId && hasScrolledDown) {
        console.log("URL 모드에서 위로 스크롤 허용 (이미 아래로 스크롤함)");
      }
    },
    [urlShortsId, hasScrolledDown, dynamicFeeds]
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
    const interval = setInterval(() => {
      if (!currentShortsId || !currentFeeds.length) {
        return;
      }

      // 현재 활성 슬라이드의 비디오 직접 가져오기
      const activeSlideIndex =
        document.querySelector(".video-swiper")?.swiper?.activeIndex || 0;
      const currentVideo = document.querySelector(
        `video[data-index="${activeSlideIndex}"]`
      );

      if (currentVideo && pointGaugeRef.current) {
        const isPlaying = !currentVideo.paused;
        const videoDuration = currentVideo.duration || 10; // 기본값 10초
        pointGaugeRef.current.updateWatchTime(
          currentShortsId,
          isPlaying,
          videoDuration
        );
      }
    }, 100); // 0.1초마다 업데이트 (부드러운 애니메이션)

    return () => clearInterval(interval);
  }, [currentShortsId, currentFeeds]);

  // URL 파라미터 모드에서 특정 영상 로딩 중
  if (isUrlModeLoading) {
    return <div>영상을 불러오는 중...</div>;
  }

  // 일반 피드 로딩 중 (URL 파라미터가 없을 때만)
  if (isLoading && !urlShortsId) {
    return <div>Loading...</div>;
  }

  if (feedsError) {
    return <div>Error: {feedsError.message}</div>;
  }

  // 데이터가 없을 때
  if (currentFeeds.length === 0 && !isUrlModeLoading) {
    return <div>영상을 찾을 수 없습니다.</div>;
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
          initialSlide={
            urlShortsId && dynamicFeeds.length > 0
              ? dynamicFeeds.findIndex(
                  (video) => video.shortsId === parseInt(urlShortsId)
                )
              : 0
          }
          className="video-swiper"
          keyboard={{
            enabled: true,
            pageUpDown: urlShortsId ? false : true, // URL 파라미터 모드에서는 위/아래 키 비활성화
          }}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false, // 끝에서도 스크롤 가능하도록
          }}
          modules={[FreeMode, Keyboard, Mousewheel]}
          touchRatio={1}
          touchAngle={45}
          grabCursor={true}
          onSlideChange={handleSlideChange}
          onReachEnd={handleReachEnd}
          onReachBeginning={handleReachBeginning}
          loop={false} // 순환 비활성화 (위로 스크롤 방지)
          allowSlideNext={true} // 다음 슬라이드로 이동 허용
          allowSlidePrev={urlShortsId ? hasScrolledDown : true} // URL 파라미터 모드에서는 아래로 스크롤 후에만 이전 슬라이드 이동 허용
        >
          {currentFeeds.map((item, index) => (
            <SwiperSlide
              key={`${item.shortsId}-${index}`}
              data-shorts-id={item.shortsId}
            >
              <div className="video-container">
                <div className="video-placeholder">
                  <div
                    className="video-player"
                    onMouseEnter={handleVideoMouseEnter}
                    onMouseLeave={handleVideoMouseLeave}
                    onMouseMove={handleVideoMouseMove}
                  >
                    <video
                      data-index={index}
                      style={{ width: "100%", height: "100%" }}
                      src={`https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/${item.videoName}`}
                      muted={isMuted}
                      loop
                      onClick={handleVideoClick}
                      onLoadedData={(e) => {
                        // URL 파라미터 모드에서는 타겟 영상의 인덱스 확인
                        const shouldAutoPlay =
                          urlShortsId && dynamicFeeds.length > 0
                            ? item.shortsId === parseInt(urlShortsId) // 타겟 영상인지 확인
                            : index === 0; // 일반 모드에서는 첫 번째 영상

                        if (shouldAutoPlay) {
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
                        opacity: showVideoControls ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
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
                        opacity: showVideoControls ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
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
