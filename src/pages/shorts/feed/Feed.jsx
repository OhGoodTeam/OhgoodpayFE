import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useShortsFeeds } from "../../../features/shorts/hooks/feed/useShortsFeeds";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules"; // Keyboard, Mousewheel 추가
import FeedInteractionWidget from "../../../features/shorts/component/feed/FeedInteractionWidget";
import FeedCommentWidget from "../../../features/shorts/component/feed/FeedCommentWidget";
import "swiper/css";
import "swiper/css/free-mode";

const Feed = () => {
  // 쿼리 파라미터
  const [page, setPage] = useState(1);
  const size = 10;
  const keyword = "";
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
  // 현재 쇼츠 아이디
  const [currentShortsId, setCurrentShortsId] = useState(null);

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
            setCurrentShortsId(feeds[swiper.activeIndex]?.shortsId);
            console.log(feeds[swiper.activeIndex]?.shortsId);
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
            const totalSlides = feeds.length;
            const currentIndex = swiper.activeIndex;

            console.log("현재 슬라이드:", currentIndex + 1);
            console.log("전체 슬라이드:", totalSlides);

            // 마지막에서 3개 남았을 때 + 아직 로딩중이 아닐 때만 다음 페이지 로드
            if (currentIndex + 1 >= totalSlides - 3 && !isLoadingMore) {
              console.log("다음 페이지 로드");
              setPage((prev) => prev + 1);
            }
          }}
        >
          {feeds.map((item, index) => (
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
                        "https://ohgoodpay.s3.ap-northeast-2.amazonaws.com/" +
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
          currentShortsId={currentShortsId} // 현재 쇼츠 아이디
        />
      </main>
    </>
  );
};
export default Feed;
