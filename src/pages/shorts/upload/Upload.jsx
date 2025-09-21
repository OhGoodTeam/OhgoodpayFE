import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../shared/api/axiosInstance";
import { useNavigate } from "react-router-dom";

// 분리된 컴포넌트들 import
import TitleInput from "../../../features/shorts/component/upload/TitleInput";
import ContentInput from "../../../features/shorts/component/upload/ContentInput";
import SubmitButton from "../../../features/shorts/component/upload/SubmitButton";
import VideoThumbnailSection from "../../../features/shorts/component/upload/VideoThumbnailSection";
import { generateThumbnailFromVideo } from "../../../features/shorts/util/videoThumbnailGenerator";

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
      navigate("/shorts/feeds");
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
          {/* VideoThumbnailSection 컴포넌트 */}
          <VideoThumbnailSection
            videoPreviewUrl={videoPreviewUrl}
            thumbnailPreviewUrl={thumbnailPreviewUrl}
            selectedVideo={selectedVideo}
            onThumbnailChange={handleThumbnailChange}
            onThumbnailClick={handleThumbnailClick}
          />

          {/* TitleInput 컴포넌트 */}
          <TitleInput title={title} onTitleChange={setTitle} maxLength={50} />

          {/* ContentInput 컴포넌트 */}
          <ContentInput
            content={content}
            onContentChange={setContent}
            maxLength={150}
          />
        </div>
      </main>

      {/* SubmitButton 컴포넌트 */}
      <SubmitButton
        onSubmit={handleSubmit}
        isDisabled={!selectedVideo || !title.trim() || !content.trim()}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default Upload;
