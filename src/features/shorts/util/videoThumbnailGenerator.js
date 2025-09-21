// 영상의 첫 프레임을 썸네일로 생성하는 함수
export const generateThumbnailFromVideo = (videoUrl) => {
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
