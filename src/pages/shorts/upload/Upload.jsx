import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../shared/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 세션스토리지에서 동영상 가져옴
    const savedFile = sessionStorage.getItem("selectedFile");
    console.log("savedFile:", savedFile);
    if (savedFile) {
      const fileData = JSON.parse(savedFile);
      console.log("fileData:", fileData);
      setSelectedVideo(fileData);
      setVideoPreviewUrl(fileData.url);
      sessionStorage.removeItem("selectedFile");
    }
  }, []);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        file: file,
      };
      setSelectedVideo(fileData);
      setVideoPreviewUrl(fileUrl);
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    console.log("썸네일 파일 선택:", file);
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      console.log("썸네일 URL 생성:", fileUrl);
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        file: file,
      };
      setThumbnailImage(fileData);
      setThumbnailPreviewUrl(fileUrl);
    }
  };

  const handleThumbnailClick = () => {
    thumbnailInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedVideo || !title.trim() || !content.trim()) {
      alert("동영상, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // 동영상 파일 추가
      if (selectedVideo.file) {
        formData.append("video", selectedVideo.file);
      } else if (selectedVideo.url) {
        const response = await fetch(selectedVideo.url);
        const blob = await response.blob();
        const file = new File([blob], selectedVideo.name, {
          type: selectedVideo.type,
        });
        formData.append("video", file);
      }

      // 썸네일 이미지 추가 (있는 경우)
      if (thumbnailImage?.file) {
        formData.append("thumbnail", thumbnailImage.file);
      }

      // 제목, 내용 추가가
      formData.append("title", title);
      formData.append("content", content);

      console.log("FormData 내용:", formData);

      const res = await axiosInstance.post("/api/upload", formData, {
        timeout: 0,
        headers: { "Content-Type": undefined }, // application/json 비활성화 -> multipart/form-data 사용해서
      });

      // 업로드 성공시 제목, 내용, 이미지, 영상을 비움
      alert("업로드가 완료되었습니다!");
      setTitle("");
      setContent("");
      setSelectedVideo(null);
      setThumbnailImage(null);
      setVideoPreviewUrl(null);
      setThumbnailPreviewUrl(null);
      navigate("/shorts/feed");
    } catch (err) {
      console.error("업로드 오류:", err);
      const msg = err.response?.data?.message || err.message;
      alert(`업로드 중 오류: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="upload-main">
        <div className="upload-container">
          <div className="thumbnail-section">
            <div
              className="thumbnail-upload"
              id="thumbnailUpload"
              onClick={handleThumbnailClick}
            >
              {videoPreviewUrl ? (
                <div
                  className="preview-container"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "300px",
                    backgroundColor: "#000",
                  }}
                >
                  <video
                    src={videoPreviewUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                    }}
                    muted
                    preload="metadata"
                    onLoadedData={() => console.log("동영상 로드 완료")}
                    onError={(e) => console.error("동영상 로드 오류:", e)}
                  />
                  {/* 썸네일 이미지 */}
                  {thumbnailPreviewUrl && (
                    <img
                      src={thumbnailPreviewUrl}
                      alt="Thumbnail Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 2,
                      }}
                      onLoad={() => console.log("썸네일 로드 완료")}
                      onError={(e) => console.error("썸네일 로드 오류:", e)}
                    />
                  )}
                </div>
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-camera" />
                  <p>동영상을 선택하세요</p>
                </div>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                id="thumbnailInput"
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{ display: "none" }}
              />
            </div>
            {videoPreviewUrl && (
              <button
                className="change-thumbnail-btn"
                id="changeThumbnailBtn"
                onClick={handleThumbnailClick}
              >
                {thumbnailPreviewUrl ? "썸네일 변경" : "썸네일 추가"}
              </button>
            )}
          </div>

          {/* 제목 */}
          <div className="form-group">
            <label htmlFor="titleInput" className="form-label">
              제목
            </label>
            <input
              type="text"
              id="titleInput"
              className="form-input"
              placeholder="글 제목"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div className="form-group">
            <label htmlFor="contentInput" className="form-label">
              내용
            </label>
            <div className="content-input-wrapper">
              <textarea
                id="contentInput"
                className="form-textarea"
                placeholder="설명을 추가하세요..."
                maxLength={150}
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="char-count" id="charCount">
                {content.length} / 150
              </div>
            </div>
          </div>
        </div>
      </main>

      {/*작성 완료*/}
      <div className="upload-footer">
        <button
          className="complete-btn"
          id="completeBtn"
          onClick={handleSubmit}
          disabled={
            !selectedVideo || !title.trim() || !content.trim() || isSubmitting
          }
        >
          {isSubmitting ? "업로드 중..." : "작성 완료"}
        </button>
      </div>
    </>
  );
};
export default Upload;
