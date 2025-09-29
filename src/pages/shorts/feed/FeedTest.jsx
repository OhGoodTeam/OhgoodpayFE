import CameraRecorder from "../../../features/shorts/component/feed/CameraRecorder";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const FeedTest = () => {
  const navigate = useNavigate();
  const [stream, setStream] = useState(null); // 카메라 스트림

  const chunksRef = useRef([]); // 녹화 데이터

  const videoRef = useRef(null); // 실시간 카메라 비디오

  const mediaRecorderRef = useRef(null); // 녹화 레코더

  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null); // 녹화 비디오 주소

  const [isRecording, setIsRecording] = useState(false); // 녹화 상태

  // 카메라 클릭 시 실시간 카메라 스트림 출력
  const handleCameraClick = async () => {
    try {
      // 이전 스트림 정리
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }

      const constraints = { video: true, audio: false };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("카메라 호출 오류:", err);
      alert("카메라 권한을 확인해 주세요.");
    }
  };

  // 녹화 버튼
  const handleRecordClick = () => {
    console.log("녹화 버튼 클릭");
    if (!stream) return;
    try {
      // 기존 URL 정리
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
        setRecordedVideoUrl(null);
      }
      chunksRef.current = [];

      // 브라우저별 MediaRecorder 옵션 설정
      let options = {};
      if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
        options.mimeType = "video/webm; codecs=vp9";
      } else if (MediaRecorder.isTypeSupported("video/webm; codecs=vp8")) {
        options.mimeType = "video/webm; codecs=vp8";
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        options.mimeType = "video/mp4";
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorderRef.current?.mimeType || "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);

        // 스트림 정지 및 미리보기 해제
        if (stream) stream.getTracks().forEach((t) => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };

      mediaRecorderRef.current.start(1000); // 1초마다 데이터 수집
      setIsRecording(true);
    } catch (err) {
      console.error("녹화 시작 오류:", err);
    }
  };

  // 녹화중지
  const handleStopRecording = () => {
    console.log("녹화중지 버튼 클릭");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // 녹화 보내기
  const handleSendRecording = async () => {
    if (!recordedVideoUrl) {
      alert("녹화된 영상이 없습니다.");
      return;
    }

    try {
      // blob URL에서 실제 파일 데이터 가져오기
      const response = await fetch(recordedVideoUrl);
      const blob = await response.blob();

      // File 객체 생성
      const file = new File([blob], `recording_${Date.now()}.webm`, {
        type: blob.type || "video/webm",
        lastModified: new Date().getTime(),
      });

      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: recordedVideoUrl,
        lastModified: file.lastModified,
      };

      sessionStorage.setItem("selectedFile", JSON.stringify(fileData));
      window.tempSelectedFile = file; // 실제 File 객체 저장
      navigate("/shorts/upload");
    } catch (error) {
      console.error("녹화 파일 처리 오류:", error);
      alert("녹화 파일을 처리하는 중 오류가 발생했습니다.");
    }
  };

  // 언마운트/URL 교체 시 정리
  useEffect(() => {
    return () => {
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [recordedVideoUrl, stream]);

  return (
    <div>
      <style>{`
        .ft-rec-indicator { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 16px; font-size: 12px; z-index: 2000; background: rgba(0,0,0,0.6); border: 1px solid #333; }
        .ft-rec-indicator .dot { width: 8px; height: 8px; border-radius: 50%; background: #777; }
        .ft-rec-indicator.recording { border-color: #ff4d4f; }
        .ft-rec-indicator.recording .dot { background: #ff4d4f; animation: ft-blink 1s infinite; }
        .ft-rec-indicator.stopped { border-color: #444; }
        .ft-rec-indicator .label { letter-spacing: 0.5px; color: #fff; opacity: 0.9; }
        @keyframes ft-blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
      `}</style>
      {/* <CameraRecorder /> */}
      <div className="main-content" style={{ height: "100vh" }}>
        {/* 녹화 상태 표시 */}
        <div
          className={`ft-rec-indicator ${
            isRecording ? "recording" : "stopped"
          }`}
        >
          <span className="dot" />
          <span className="label">{isRecording ? "REC" : "STOPPED"}</span>
        </div>
        {/* 촤영버튼 */}
        <button onClick={handleCameraClick}>카메라호출</button>
        {/* 녹화버튼 */}
        <button onClick={handleRecordClick}>녹화버튼</button>
        {/* 녹화중지 */}
        <button onClick={handleStopRecording}>녹화중지</button>
        {/* 녹화 보내기 */}
        <button onClick={handleSendRecording}>녹화 보내기</button>
        {/* 실시간 카메라 */}
        <div style={{ height: "100vh", objectFit: "cover" }}>
          {recordedVideoUrl ? (
            // 녹화된 영상 재생
            <video
              src={recordedVideoUrl}
              controls
              playsInline
              autoPlay
              style={{ width: "100%", maxHeight: 400 }}
            />
          ) : (
            // 실시간 카메라 프리뷰
            <video
              style={{ width: "100%", objectFit: "cover" }}
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedTest;
