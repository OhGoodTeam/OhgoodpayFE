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
  const thumbnailInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 세션스토리지에서 동영상 가져옴
    const savedFile = sessionStorage.getItem("selectedFile");
    console.log("savedFile:", savedFile);
    if (savedFile) {
      const fileData = JSON.parse(savedFile);
      console.log("fileData:", fileData);
      console.log("fileData.url:", fileData.url);

      // window 객체에서 File 가져옴
      const tempFile = window.tempSelectedFile;
      console.log("tempFile:", tempFile);

      if (tempFile) {
        fileData.file = tempFile;
        delete window.tempSelectedFile;
      }

      setSelectedVideo(fileData);
      setVideoPreviewUrl(fileData.url);
      sessionStorage.removeItem("selectedFile");

      // 자동으로 첫 프레임 썸네일 생성
      generateThumbnailFromVideo(fileData.url)
        .then((thumbnailData) => {
          console.log("자동 썸네일 생성 성공:", thumbnailData);
          setThumbnailImage(thumbnailData);
          setThumbnailPreviewUrl(thumbnailData.url);
        })
        .catch((error) => {
          console.error("자동 썸네일 생성 실패:", error);
        });
    }
  }, []);

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

  // 영상의 첫 프레임을 썸네일로 생성하는 함수
  const generateThumbnailFromVideo = (videoUrl) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.addEventListener("loadeddata", () => {
        // 영상의 첫 프레임으로 설정
        video.currentTime = 0;
      });

      video.addEventListener("seeked", () => {
        // 캔버스 크기를 영상 크기에 맞춤
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 첫 프레임을 캔버스에 그리기
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 캔버스를 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "thumbnail.jpg", {
                type: "image/jpeg",
              });
              const fileUrl = URL.createObjectURL(blob);
              const fileData = {
                name: "thumbnail.jpg",
                size: blob.size,
                type: "image/jpeg",
                url: fileUrl,
                file: file,
              };
              resolve(fileData);
            } else {
              reject(new Error("썸네일 생성 실패"));
            }
          },
          "image/jpeg",
          0.8
        );
      });

      video.addEventListener("error", (e) => {
        reject(new Error("영상 로드 실패: " + e.message));
      });

      video.src = videoUrl;
      video.load();
    });
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
        console.log("selectedVideo.file 사용:", selectedVideo.file);
        formData.append("video", selectedVideo.file);
      } else if (selectedVideo.url) {
        console.log("selectedVideo.url에서 파일 변환:", selectedVideo.url);
        try {
          const response = await fetch(selectedVideo.url);
          const blob = await response.blob();
          const file = new File([blob], selectedVideo.name || "video.mp4", {
            type: selectedVideo.type || "video/mp4",
          });
          console.log("변환된 파일:", file);
          formData.append("video", file);
        } catch (error) {
          console.error("URL에서 파일 변환 오류:", error);
          throw new Error("동영상 파일을 처리할 수 없습니다.");
        }
      } else {
        console.error("selectedVideo 정보 없음:", selectedVideo);
        throw new Error("동영상 파일이 선택되지 않았습니다.");
      }

      // 썸네일 이미지 추가 (있는 경우)
      if (thumbnailImage?.file) {
        formData.append("thumbnail", thumbnailImage.file);
      }

      // 제목, 내용 추가
      formData.append("title", title);
      formData.append("content", content);

      // FormData 내용 확인
      console.log("FormData 내용:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await axiosInstance.post("/upload", formData, {
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
