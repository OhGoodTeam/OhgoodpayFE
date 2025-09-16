import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useShortsFeeds } from "../../../features/shorts/hooks/feed/useShortsFeeds";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules"; // Keyboard, Mousewheel 추가
import FeedInteractionWidget from "../../../features/shorts/component/feed/FeedInteractionWidget";
import FeedCommentWidget from "../../../features/shorts/component/feed/FeedCommentWidget";
import PointGauge from "../../../features/shorts/component/feed/PointGauge";
import ShareModal from "./ShareModal";
import axiosInstance from "../../../shared/api/axiosInstance";
import "swiper/css";
import "swiper/css/free-mode";

const Feed = () => {
  // URL 파라미터 처리
  const [searchParams] = useSearchParams();
  const urlShortsId = searchParams.get("shortsId");

  // 쿼리 파라미터
  const [page, setPage] = useState(1);
  const size = 10;
  const keyword = "";

  // 현재 쇼츠 아이디 (먼저 선언)
  const [currentShortsId, setCurrentShortsId] = useState(null);

  // 공유 모달 상태
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 특정 영상 데이터 상태
  const [specificVideoData, setSpecificVideoData] = useState(null);
  const [loadingSpecificVideo, setLoadingSpecificVideo] = useState(false);

  const {
    data: feeds,
    error,
    isLoading,
    isLoadingMore,
  } = useShortsFeeds({
    page,
    size,
    keyword,
  });

  // 특정 영상 데이터 가져오기
  const fetchSpecificVideo = async (shortsId) => {
    try {
      setLoadingSpecificVideo(true);
      const response = await axiosInstance.get(`/api/shorts/${shortsId}`);
      console.log("특정 영상 데이터:", response.data);
      setSpecificVideoData(response.data);
      setCurrentShortsId(shortsId);
    } catch (error) {
      console.error("특정 영상 로드 실패:", error);
      // 에러 시 일반 피드로 이동
      if (feeds && feeds.length > 0) {
        setCurrentShortsId(feeds[0].shortsId);
      }
    } finally {
      setLoadingSpecificVideo(false);
    }
  };

  // 특정 영상을 중심으로 피드 데이터 재정렬
  const reorderFeedsAroundTarget = (targetShortsId) => {
    if (!feeds || feeds.length === 0) {
      console.log("피드 데이터가 없음");
      return feeds;
    }

    console.log("재정렬 시작:", {
      targetShortsId,
      availableShortsIds: feeds.map((f) => f.shortsId),
      feedsLength: feeds.length,
    });

    // shortsId로 정렬된 피드에서 타겟 영상의 인덱스 찾기
    const sortedFeeds = [...feeds].sort((a, b) => a.shortsId - b.shortsId);
    const targetIndex = sortedFeeds.findIndex(
      (feed) => feed.shortsId === targetShortsId
    );

    console.log("타겟 영상 검색 결과:", {
      targetShortsId,
      targetIndex,
      sortedShortsIds: sortedFeeds.map((f) => f.shortsId),
    });

    if (targetIndex === -1) {
      console.log("타겟 영상을 피드에서 찾을 수 없음:", targetShortsId);
      return feeds; // 타겟을 찾을 수 없으면 원본 피드 반환
    }

    // 타겟 영상을 중심으로 이전/다음 영상들 포함하여 새로운 배열 생성
    const reorderedFeeds = [];

    // 타겟 영상부터 시작해서 이후 영상들 추가
    for (let i = targetIndex; i < sortedFeeds.length; i++) {
      reorderedFeeds.push(sortedFeeds[i]);
    }

    // 타겟 영상 이전의 영상들 추가 (역순으로)
    for (let i = targetIndex - 1; i >= 0; i--) {
      reorderedFeeds.push(sortedFeeds[i]);
    }

    console.log("재정렬된 피드:", {
      targetShortsId,
      originalLength: feeds.length,
      reorderedLength: reorderedFeeds.length,
      firstVideo: reorderedFeeds[0]?.shortsId,
      lastVideo: reorderedFeeds[reorderedFeeds.length - 1]?.shortsId,
      reorderedShortsIds: reorderedFeeds.map((f) => f.shortsId),
    });

    return reorderedFeeds;
  };

  // URL 파라미터로 특정 영상 요청
  useEffect(() => {
    console.log("URL 파라미터 useEffect 실행:", { urlShortsId });
    if (urlShortsId) {
      console.log("특정 영상 요청:", parseInt(urlShortsId));
      fetchSpecificVideo(parseInt(urlShortsId));
    }
  }, [urlShortsId]);

  // feeds가 로드되면 첫 번째 영상의 shortsId 설정 또는 URL 파라미터로 특정 영상으로 이동
  useEffect(() => {
    console.log("feeds 로드 useEffect 실행:", {
      feedsLength: feeds?.length,
      urlShortsId,
      specificVideoData: !!specificVideoData,
      currentShortsId,
    });

    if (feeds && feeds.length > 0) {
      if (urlShortsId && specificVideoData) {
        // URL 파라미터로 특정 영상이 있고 특정 영상 데이터도 있으면 해당 영상으로 이동
        console.log("특정 영상 모드로 이동:", parseInt(urlShortsId));
        // 재정렬된 피드에서 타겟 영상은 항상 첫 번째 인덱스(0)에 위치
        setCurrentShortsId(parseInt(urlShortsId));
        // Swiper를 첫 번째 슬라이드(타겟 영상)로 이동
        setTimeout(() => {
          const swiper = document.querySelector(".video-swiper")?.swiper;
          if (swiper) {
            console.log("Swiper를 인덱스 0으로 이동");
            swiper.slideTo(0); // 재정렬된 피드에서 타겟 영상은 항상 인덱스 0
          } else {
            console.log("Swiper를 찾을 수 없음");
          }
        }, 100);
      } else if (!urlShortsId && !currentShortsId) {
        // URL 파라미터가 없으면 첫 번째 영상으로
        setCurrentShortsId(feeds[0].shortsId);
        console.log(
          "feeds 로드 후 첫 번째 영상 shortsId 설정:",
          feeds[0].shortsId
        );
      }
    }
  }, [feeds, currentShortsId, urlShortsId, specificVideoData]);

  // 업로드 옵션 토글
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const uploadContainerRef = useRef(null);
  // 숨겨진 Input 참조
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  // 비디오 제어
  const videoElement = useRef("");
  // 재생, 일시정지 아이콘
  const playIcon = useRef("");

  // 포인트 게이지 관련 상태
  const [customerId] = useState(1); // 실제로는 로그인한 사용자 ID를 사용
  const pointGaugeRef = useRef(null);

  // 업로드 클릭 이벤트
  const handleUploadClick = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  // 카메라 호출 이벤트
  const handleCameraClick = () => {
    console.log("카메라 호출");
    setShowUploadOptions(false);
  };

  // 갤러리 호출 이벤트
  const handleGalleryClick = () => {
    setShowUploadOptions(false); // 업로드 옵션 창 닫기
    fileInputRef.current.click(); // 파일 선택 창
  };

  // 외부 클릭 시 토글 닫기
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // 1. 파일 유효성 검사
    if (file && file.type.startsWith("video/")) {
      // 2. 파일 정보 출력
      console.log("파일명", file.name);
      console.log("선택된 파일 타입", file.type);
      console.log("파일 크기", file.size);

      // 3. 비디오 미리보기 URL 생성
      const videoUrl = URL.createObjectURL(file);

      // 4. 파일 데이터를 세션스토리지에 저장
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: videoUrl,
        lastModified: file.lastModified,
      };

      sessionStorage.setItem("selectedFile", JSON.stringify(fileData));

      // 5. File 객체를 window에 임시 저장 (Upload 페이지에서 사용)
      window.tempSelectedFile = file;

      // 6. Upload 페이지로 이동
      navigate("/shorts/upload");
    } else if (file) {
      alert("비디오 파일만 선택해주세요.");
    }
  };

  const handleVideoClick = () => {
    if (!videoElement.current) return; // 비디오 유효성 검사

    const video = videoElement.current;

    if (!video.paused) {
      video.play();
      playIcon.current.classList.add("fa-pause");
      playIcon.current.classList.remove("fa-play");
    } else {
      video.pause();
      playIcon.current.classList.add("fa-play");
      playIcon.current.classList.remove("fa-pause");
    }
  };

  // 비디오 재생 상태 추적 및 포인트 업데이트
  useEffect(() => {
    const currentFeeds =
      urlShortsId && specificVideoData
        ? reorderFeedsAroundTarget(parseInt(urlShortsId))
        : feeds;

    console.log("useEffect 실행:", {
      currentShortsId,
      feedsLength: currentFeeds.length,
      pointGaugeRef: !!pointGaugeRef.current,
    });

    const interval = setInterval(() => {
      console.log("인터벌 실행:", {
        currentShortsId,
        feedsLength: currentFeeds.length,
      });

      if (!currentShortsId || !currentFeeds.length) {
        console.log("조건 불만족:", {
          currentShortsId,
          feedsLength: currentFeeds.length,
        });
        return;
      }

      const videoIndex = currentFeeds.findIndex(
        (feed) => feed.shortsId === currentShortsId
      );
      console.log("비디오 인덱스:", videoIndex);

      const currentVideo = document.querySelector(
        `video[data-index="${videoIndex}"]`
      );
      console.log("비디오 엘리먼트:", !!currentVideo);

      if (currentVideo && pointGaugeRef.current) {
        const isPlaying = !currentVideo.paused;
        const playbackPos = currentVideo.currentTime;

        // 디버깅용 콘솔 로그
        console.log("비디오 상태:", {
          shortsId: currentShortsId,
          isPlaying: isPlaying,
          playbackPos: playbackPos,
          videoElement: !!currentVideo,
        });

        // 포인트 게이지에 시청 정보 전달
        pointGaugeRef.current.updateWatchTime(
          currentShortsId,
          isPlaying,
          playbackPos
        );
      } else {
        console.log("조건 불만족:", {
          hasVideo: !!currentVideo,
          hasPointGauge: !!pointGaugeRef.current,
        });
      }
    }, 5000); // 5초마다 체크

    return () => clearInterval(interval);
  }, [currentShortsId, feeds, urlShortsId, specificVideoData]);

  // 댓글 모달 관련 요소들
  // js -> react
  const commentModalRef = useRef(null); // 댓글 모달 창
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // 댓글 모달 열기/닫기
  // js -> react
  const handleCommentClick = () => {
    console.log("댓글 클릭");
    const modal = commentModalRef.current;
    if (modal.classList.contains("open")) {
      setIsCommentModalOpen(false);
      modal.classList.remove("open");
    } else {
      setIsCommentModalOpen(true);
      modal.classList.add("open");
    }
  };

  // 공유 모달 열기/닫기
  const handleShareClick = () => {
    console.log("공유 클릭");
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // 특정 영상 로딩 중 (일반 피드도 함께 로딩)
  if (loadingSpecificVideo && isLoading) {
    return <div>영상을 불러오는 중...</div>;
  }

  // 일반 피드 로딩 중
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div> {error.message}</div>;
  }

  return (
    <>
      {/* 숨겨진 input  */}
      <input
        type="file"
        id="fileInput"
        accept="video/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* 메인 컨텐츠 영역 - Swiper */}
      <main className="main-content">
        <Swiper
          direction="vertical" // 세로 방향
          slidesPerView={1} // 한 화면에 하나만
          spaceBetween={0} // 슬라이드 간격
          allowTouchMove={true} // 터치 이동 허용
          resistanceRatio={0.85} // 저항 비율
          threshold={50} // 스와이프 강도
          className="video-swiper"
          keyboard={{
            enabled: true,
            pageUpDown: true, // 페이지 업/다운 제어
          }}
          mousewheel={{
            enabled: true,
            forceToAxis: true, // 마우스 휠 제어 활성화
          }}
          modules={[FreeMode, Keyboard, Mousewheel]} // 모듈 설정
          touchRatio={1} // 터치 제스처 비율
          touchAngle={45} // 터치 제스처 각도
          grabCursor={true} // 터치 제스처 효과
          onSlideChange={(swiper) => {
            // 현재 쇼츠 아이디
            const currentFeeds =
              urlShortsId && specificVideoData
                ? reorderFeedsAroundTarget(parseInt(urlShortsId))
                : feeds;
            setCurrentShortsId(currentFeeds[swiper.activeIndex]?.shortsId);
            console.log(currentFeeds[swiper.activeIndex]?.shortsId);

            // 이전 비디오 일시 정지
            const prevVideo = document.querySelector(
              `video[data-index="${swiper.activeIndex - 1}"]`
            );
            if (prevVideo?.pause) {
              // 이전 비디오가 있고 일시 정지 상태라면
              // ? 연산자는 이전 비디오가 있는지 확인하고 일시 정지 상태라면 일시 정지 시킨다.
              prevVideo.pause();
            }

            // 현재 비디오 재생
            const currentVideoElement = document.querySelector(
              `video[data-index="${swiper.activeIndex}"]`
            );
            if (currentVideoElement) {
              if (currentVideoElement.readyState >= 2) {
                // 비디오 데이터가 로드되었는지 확인
                // readyState 2는 비디오 데이터가 로드되었는지 확인하는 상태
                currentVideoElement.currentTime = 0;
                // currentTime 속성은 비디오 재생 위치를 설정하는 속성
                currentVideoElement.play();
              }
            }
          }}
          onReachEnd={(swiper) => {
            const currentFeeds =
              urlShortsId && specificVideoData
                ? reorderFeedsAroundTarget(parseInt(urlShortsId))
                : feeds;
            const totalSlides = currentFeeds.length;
            const currentIndex = swiper.activeIndex;

            console.log("현재 슬라이드:", currentIndex + 1);
            console.log("전체 슬라이드:", totalSlides);

            // 특정 영상 모드가 아닐 때만 다음 페이지 로드
            if (
              !urlShortsId &&
              currentIndex + 1 >= totalSlides - 3 &&
              !isLoadingMore
            ) {
              console.log("다음 페이지 로드");
              setPage((prev) => prev + 1);
            }
          }}
        >
          {(urlShortsId && specificVideoData
            ? reorderFeedsAroundTarget(parseInt(urlShortsId))
            : feeds
          ).map((item, index) => (
            <SwiperSlide
              key={`${item.shortsId}-${index}`}
              data-shorts-id={item.shortsId}
            >
              <div className="video-container" onClick={handleVideoClick}>
                <div className="video-placeholder">
                  {/* 비디오 플레이어 영역 */}
                  <div className="video-player">
                    <video
                      ref={videoElement}
                      data-index={index}
                      style={{ width: "100%" }}
                      src={
                        "https://ohgoodpay2.s3.ap-northeast-2.amazonaws.com/" +
                        item.videoName
                      }
                      // autoPlay
                      muted
                      loop
                      controls
                      onLoadedData={() => {
                        if (index === 0) {
                          document
                            .querySelector(`video[data-index="${index}"]`)
                            .play();
                          // 첫 번째 영상의 shortsId 설정
                          setCurrentShortsId(item.shortsId);
                          console.log(
                            "첫 번째 영상 shortsId 설정:",
                            item.shortsId
                          );
                        }
                      }}
                    />
                    <i
                      ref={playIcon}
                      // className="fas fa-play fa-pause"
                      style={{
                        position: "absolute",
                      }}
                    />
                  </div>
                </div>

                {/* 하단 비디오 정보 */}
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

        {/* 댓글창 */}
        <FeedCommentWidget
          commentModalRef={commentModalRef}
          handleCommentClick={handleCommentClick}
          shortsId={currentShortsId}
          isCommentModalOpen={isCommentModalOpen} // 댓글 모달 열기/닫기 상태
        />

        {/* 고정된 오른쪽 인터랙션 바 */}
        <FeedInteractionWidget
          handleUploadClick={handleUploadClick} // 업로드 클릭 이벤트
          handleCameraClick={handleCameraClick} // 카메라 호출 이벤트
          handleGalleryClick={handleGalleryClick} // 갤러리 호출 이벤트
          uploadContainerRef={uploadContainerRef} // 업로드 컨테이너 참조
          showUploadOptions={showUploadOptions} // 업로드 옵션 토글
          handleCommentClick={handleCommentClick} // 댓글 클릭 이벤트
          handleShareClick={handleShareClick} // 공유 클릭 이벤트
          currentShortsId={currentShortsId} // 현재 쇼츠 아이디
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
