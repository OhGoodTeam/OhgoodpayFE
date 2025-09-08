import { useState, useEffect, useRef } from "react";

const Feed = () => {
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const uploadContainerRef = useRef(null);

  const handleUploadClick = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const handleCameraClick = () => {
    // 카메라 호출 로직
    console.log("카메라 호출");
    setShowUploadOptions(false);
  };

  const handleGalleryClick = () => {
    // 갤러리에서 선택 로직
    console.log("갤러리에서 선택");
    setShowUploadOptions(false);
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

  return (
    <>
      {/* 메인 컨텐츠 영역 */}
      <main className="main-content">
        {/* 비디오 영역 */}
        <div className="video-container">
          <div className="video-placeholder">{/* 비디오 플레이어 영역 */}</div>

          {/* 오른쪽 인터랙션 바 */}
          <div className="interaction-bar">
            <div className="upload-container" ref={uploadContainerRef}>
              <button className="upload-btn" onClick={handleUploadClick}>
                <i className="fas fa-plus" />
                <span>업로드</span>
              </button>

              {/* 업로드 옵션 토글 */}
              {showUploadOptions && (
                <div className="upload-options">
                  <button
                    className="upload-option-btn"
                    onClick={handleCameraClick}
                  >
                    <i className="fas fa-camera" />
                    <span>카메라</span>
                  </button>
                  <button
                    className="upload-option-btn"
                    onClick={handleGalleryClick}
                  >
                    <i className="fas fa-images" />
                    <span>갤러리</span>
                  </button>
                </div>
              )}
            </div>
            <button className="like-btn">
              <i className="fas fa-thumbs-up" />
              <span>99</span>
            </button>
            <button className="dislike-btn">
              <i className="fas fa-thumbs-down" />
              <span>싫어요</span>
            </button>
            <button className="comment-btn" id="commentToggle">
              <i className="fas fa-comment" />
              <span>99</span>
            </button>
            <button className="share-btn">
              <i className="fas fa-paper-plane" />
              <span>공유</span>
            </button>
          </div>

          {/* 하단 비디오 정보 */}
          <div className="video-info">
            <div className="user-info">
              <div className="profile-pic" />
              <div className="user-details">
                <span className="username">user_name</span>
                <button className="subscribe-btn">구독</button>
              </div>
            </div>
            <div className="video-description">
              ㅍ100자가 궁금합니다. 이게 100자일까요. 어느정도가 100자일까요
              지금 42자인데요 이정도면 괜찮을까요? 100자가 궁금합니다. 이제
              100자가 되는거같아요. 100일까요? 100자가 궁금합니다. 이제 100자가
              되는거같아요. 100일까요?
              <br />
              <br />
              2025년 8월 28일
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Feed;
