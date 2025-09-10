import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const uploadContainerRef = useRef(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleUploadClick = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const handleCameraClick = () => {
    // 카메라 호출
    console.log("카메라 호출");
    setShowUploadOptions(false);
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    // 갤러리에서 선택
    console.log("갤러리에서 선택");
    setShowUploadOptions(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        // File 객체는 JSON 안됨됨
      };

      // sessionStorage에 파일 저장
      sessionStorage.setItem("selectedFile", JSON.stringify(fileData));

      // File을 윈도우 객체에 저장장
      window.tempSelectedFile = file;

      // upload 페이지로 이동
      navigate("/shorts/upload");
    }
  };

  const handleCameraChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        // File 객체는 JSON.stringify로 직렬화할 수 없으므로 제외
      };

      // sessionStorage에 파일 정보 저장 (File 객체 제외)
      sessionStorage.setItem("selectedFile", JSON.stringify(fileData));

      // File 객체를 별도로 저장 (임시로 window 객체에 저장)
      window.tempSelectedFile = file;

      // upload 페이지로 이동
      navigate("/shorts/upload");
    }
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
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleCameraChange}
        style={{ display: "none" }}
      />

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
