/*
React Camera + Video Recorder (single-file)

Usage:
1. Copy this file into your React project (e.g., src/components/CameraRecorder.jsx).
2. Import and render: import CameraRecorder from './CameraRecorder';
3. The page must be served over HTTPS (or localhost) for getUserMedia to work.

Notes:
- The component uses getUserMedia(), MediaRecorder, and enumerateDevices().
- On mobile, it will try to pick the back camera (facingMode: 'environment') when available.
- Some browsers (notably older iOS Safari) have limited MediaRecorder support. If MediaRecorder isn't supported, the UI will show an error and a fallback could be implemented (e.g., capture frames into canvas).
- You can switch between available cameras (desktop webcams / phone front/back) using the "Switch Camera" button.
*/

import React, { useEffect, useRef, useState } from "react";

export default function CameraRecorder() {
  const previewRef = useRef(null);
  const playbackRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // helper: enumerate video input devices
  async function updateDeviceList() {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = all.filter((d) => d.kind === "videoinput");
      setDevices(videoInputs);
      // if no selected device but devices exist, pick the first
      if (!selectedDeviceId && videoInputs.length)
        setSelectedDeviceId(videoInputs[0].deviceId || null);
    } catch (e) {
      console.error("enumerateDevices failed", e);
    }
  }

  // start camera preview with either a specific deviceId or facingMode fallback
  async function startPreview(deviceId = null) {
    setError(null);
    stopStream();

    const constraints = {
      audio: true,
      video: deviceId
        ? {
            deviceId: { exact: deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        : {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
    };

    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = s;
      if (previewRef.current) {
        previewRef.current.srcObject = s;
        previewRef.current.play().catch(() => {});
      }
      // refresh device list after getting permission (labels appear)
      updateDeviceList();
    } catch (e) {
      console.error("getUserMedia error", e);
      setError(String(e));
    }
  }

  function stopStream() {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (previewRef.current) previewRef.current.srcObject = null;
  }

  // start recording using MediaRecorder
  function startRecording() {
    setError(null);
    if (!streamRef.current) {
      setError("No media stream available to record. Start preview first.");
      return;
    }

    let options = {};
    // prefer webm if available
    if (
      MediaRecorder.isTypeSupported &&
      MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ) {
      options = { mimeType: "video/webm;codecs=vp9" };
    } else if (
      MediaRecorder.isTypeSupported &&
      MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
    ) {
      options = { mimeType: "video/webm;codecs=vp8" };
    }

    try {
      const mr = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mr;
      setRecordedChunks([]);
      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          setRecordedChunks((prev) => [...prev, ev.data]);
        }
      };
      mr.onstart = () => {
        setIsRecording(true);
        setElapsed(0);
      };
      mr.onstop = () => {
        setIsRecording(false);
      };
      mr.onerror = (ev) => {
        console.error("MediaRecorder error", ev);
        setError("Recording error: " + ev);
      };
      mr.start(1000); // collect data in 1s chunks

      // simple timer
      const timerId = setInterval(() => setElapsed((s) => s + 1), 1000);
      // clear timer when recording stops
      mr.addEventListener("stop", () => clearInterval(timerId));
    } catch (e) {
      console.error("MediaRecorder construction failed", e);
      setError("Recording not supported in this browser: " + e);
    }
  }

  // stop recording and create playback blob
  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    mediaRecorderRef.current = null;

    // stop tracks but keep preview until user wants to close
    // (we won't stop stream here to allow multiple recordings from same preview)
    // create blob and set to playback video
    setTimeout(() => {
      if (recordedChunks.length === 0) return;
      const blob = new Blob(recordedChunks, {
        type: recordedChunks[0].type || "video/webm",
      });
      if (playbackRef.current) {
        playbackRef.current.src = URL.createObjectURL(blob);
      }
    }, 200);
  }

  function downloadLast() {
    if (!recordedChunks || recordedChunks.length === 0) return;
    const blob = new Blob(recordedChunks, {
      type: recordedChunks[0].type || "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // switch camera - either cycle through device list (preferred) or toggle facing mode
  function switchCamera() {
    if (devices.length > 1) {
      const idx = devices.findIndex((d) => d.deviceId === selectedDeviceId);
      const next = devices[(idx + 1) % devices.length];
      setSelectedDeviceId(next.deviceId);
      startPreview(next.deviceId);
    } else {
      // fallback: restart with facingMode toggled
      startPreview(null);
    }
  }

  // tear down on unmount
  useEffect(() => {
    updateDeviceList();
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // whenever selectedDeviceId changes, restart preview
  useEffect(() => {
    if (selectedDeviceId !== null) startPreview(selectedDeviceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Camera Recorder</h2>

      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Live preview</label>
          <video
            ref={previewRef}
            className="w-full h-64 bg-black rounded shadow"
            playsInline
            muted
            autoPlay
          />

          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white"
              onClick={() => startPreview(selectedDeviceId)}
            >
              Start Preview
            </button>

            <button
              className="px-3 py-1 rounded bg-gray-600 text-white"
              onClick={switchCamera}
            >
              Switch Camera
            </button>

            <button
              className="px-3 py-1 rounded bg-red-600 text-white"
              onClick={() => {
                stopStream();
              }}
            >
              Stop Camera
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Available cameras: {devices.length}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Controls</label>
          <div className="flex gap-2">
            {!isRecording ? (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={startRecording}
              >
                Start Recording
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-yellow-600 text-white rounded"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
            )}

            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={downloadLast}
              disabled={recordedChunks.length === 0}
            >
              Download
            </button>

            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => {
                // play recorded clip in separate element
                if (playbackRef.current) playbackRef.current.play();
              }}
              disabled={recordedChunks.length === 0}
            >
              Play
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-700">
            Recording: {isRecording ? "● LIVE" : "stopped"}
          </div>
          <div className="text-sm text-gray-500">Elapsed: {elapsed}s</div>

          <div className="mt-4">
            <label className="block text-sm mb-1">Recorded clip</label>
            <video
              ref={playbackRef}
              className="w-full h-48 bg-black rounded"
              controls
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Tip: Serve your app over HTTPS and allow camera & microphone
        permissions. On mobile, choose "Allow" when the browser prompts.
      </div>
    </div>
  );
}
