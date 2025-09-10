import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const Upload = () => {
  // 현재 페이지 위치 정보
  const location = useLocation();
  // 선택된 파일 바인딩
  const [selectedFile, setSelectedFile] = useState(null);
  // 비디오 미리보기
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  useEffect(() => {
    // location.state 에서 파일 가져오기
    if (location.state && location.state.selectedFile) {
      const file = location.state.selectedFile;
      setSelectedFile(file);

      // 비디오 미리보기 url 생성
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className="upload-main">
        <div className="upload-container">
          {/* 썸네일 업로드 영역 */}
          <div className="thumbnail-section">
            <div className="thumbnail-upload" id="thumbnailUpload">
              {selectedFile && videoPreviewUrl ? (
                <video src={videoPreviewUrl} className="thumbnail-preview" />
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-camera" />
                  <p>
                    사진 또는 동영상을
                    <br />
                    선택하세요
                  </p>
                </div>
              )}

              <input
                type="file"
                id="fileInput"
                accept="image/*,video/*"
                style={{ display: "none" }}
              />
            </div>
            <button
              className="change-thumbnail-btn"
              id="changeThumbnailBtn"
              // style={{ display: "block" }}
            >
              썸네일 변경
            </button>
          </div>

          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="titleInput" className="form-label">
              제목
            </label>
            <input
              type="text"
              id="titleInput"
              className="form-input"
              placeholder="\uAE00 \uC81C\uBAA9"
              maxLength={50}
            />
          </div>

          {/* 내용 입력 */}
          <div className="form-group">
            <label htmlFor="contentInput" className="form-label">
              내용
            </label>
            <div className="content-input-wrapper">
              <textarea
                id="contentInput"
                className="form-textarea"
                placeholder="\uC124\uBA85\uC744 \uCD94\uAC00\uD558\uC138\uC694..."
                maxLength={150}
                rows={4}
              />
              <div className="char-count" id="charCount">
                0 / 150
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 작성 완료 버튼 */}
      <div className="upload-footer">
        <button className="complete-btn" id="completeBtn" disabled>
          작성 완료
        </button>
      </div>
    </>
  );
};
export default Upload;
