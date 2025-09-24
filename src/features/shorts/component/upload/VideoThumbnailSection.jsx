import { useRef } from "react";

// 비디오, 썸네일 부분 컴포넌트
const VideoThumbnailSection = ({
  videoPreviewUrl,
  thumbnailPreviewUrl,
  selectedVideo,
  onThumbnailChange,
  onThumbnailClick,
}) => {
  const thumbnailInputRef = useRef(null);

  const handleThumbnailClick = () => {
    if (onThumbnailClick) {
      onThumbnailClick();
    } else {
      thumbnailInputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    if (onThumbnailChange) {
      onThumbnailChange(event);
    }
  };

  return (
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
              controls
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
            {/* 파일 정보 표시 */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                maxWidth: "calc(100% - 20px)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedVideo?.name || "비디오 파일"}
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <i className="fas fa-video" />
            <p>동영상을 선택하세요</p>
            <p
              style={{
                fontSize: "12px",
                color: "#888",
                marginTop: "8px",
              }}
            >
              갤러리에서 비디오를 선택하세요
            </p>
          </div>
        )}
        <input
          ref={thumbnailInputRef}
          type="file"
          id="thumbnailInput"
          accept="image/*"
          onChange={handleFileChange}
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
  );
};

export default VideoThumbnailSection;
