import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axiosInstance from "../../../../shared/api/axiosInstance";
import "../../css/PointGauge.css";

const PointGauge = forwardRef(({ customerId = 1 }, ref) => {
  const [pointData, setPointData] = useState({
    todayAccumSec: 0,
    todayPoint: 0,
    progressSec: 0,
    limitPoint: 100,
    pointPerLap: 10,
    isRewarded: false,
  });
  const [isActive, setIsActive] = useState(true);
  const [showRewardMessage, setShowRewardMessage] = useState(false);
  const [showPendingMessage, setShowPendingMessage] = useState(false);
  const [localProgressSec, setLocalProgressSec] = useState(0);
  const [currentShortsId, setCurrentShortsId] = useState(null);
  const [lastProgressSec, setLastProgressSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const [syncProgressSec, setSyncProgressSec] = useState(0);
  const [lastTodayPoint, setLastTodayPoint] = useState(0);

  // 포인트 상태 조회
  const fetchPointStatus = async () => {
    try {
      const response = await axiosInstance.get("/api/shorts/pointstatus", {
        params: { customerId },
        timeout: 3000, // 초기 로드 시에는 조금 더 여유있게
      });
      console.log("포인트 상태 조회 응답:", response.data);

      // 백엔드 응답으로 동기화
      const backendProgress = response.data.progressSec;
      setPointData(response.data);
      setLastProgressSec(backendProgress);
      setSyncProgressSec(backendProgress);
      setLastSyncTime(Date.now());
      setLocalProgressSec(backendProgress);
      setLastTodayPoint(response.data.todayPoint);

      // 하루 한도에 도달했는지 확인
      if (response.data.todayPoint >= response.data.limitPoint) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    } catch (error) {
      console.error("포인트 상태 조회 실패:", error);
    }
  };

  // 시청 시간 업데이트
  const updateWatchTime = async (shortsId, isPlaying, playbackPos) => {
    // 비디오가 변경되었으면 현재 비디오 ID만 업데이트 (진행률은 리셋하지 않음)
    if (currentShortsId !== shortsId) {
      setCurrentShortsId(shortsId);
      console.log("비디오 변경 감지:", shortsId);
    }

    // 재생 상태 업데이트
    setIsPlaying(isPlaying);

    if (!isActive) {
      console.log("게이지 비활성화:", { isActive });
      return;
    }

    // 재생 중일 때만 API 호출
    if (isPlaying) {
      try {
        console.log("API 호출 전:", {
          shortsId,
          isPlaying,
          playbackPos,
          customerId,
        });

        // 1. 먼저 POST /api/shorts/watch/feed로 시청 시간 업데이트
        await axiosInstance.post(
          "/api/shorts/watch/feed",
          {
            shortsId,
            isPlaying,
            playbackPos,
          },
          {
            params: { customerId },
            timeout: 800, // 빠른 응답 필요 (데이터 저장)
          }
        );

        // 2. 그 다음 GET /api/shorts/pointstatus로 최신 상태 조회
        const response = await axiosInstance.get("/api/shorts/pointstatus", {
          params: { customerId },
          timeout: 1200, // 조금 더 여유있게 (상태 조회)
        });

        console.log("포인트 상태 응답:", response.data);

        // 백엔드 응답으로 동기화
        const currentProgressSec = response.data.progressSec;
        setSyncProgressSec(currentProgressSec);
        setLastSyncTime(Date.now());
        setLocalProgressSec(currentProgressSec);

        // 백엔드에서 포인트 획득 감지
        const currentTodayPoint = response.data.todayPoint;
        const progressPercentage = (currentProgressSec / 60) * 100;
        const lastProgressPercentage = (lastProgressSec / 60) * 100;

        // 조건 1: 이전 진행률이 50% 이상이고 현재가 10% 미만이면 한 바퀴 완료
        // 조건 2: 백엔드에서 isRewarded가 true인 경우
        // 조건 3: todayPoint가 실제로 증가한 경우
        const isProgressReset =
          lastProgressPercentage >= 50 && progressPercentage < 10;
        const isBackendRewarded = response.data.isRewarded;
        const isPointIncreased = currentTodayPoint > lastTodayPoint;

        // 임시 메시지가 표시된 상태에서 백엔드 응답 처리
        if (showPendingMessage) {
          if (isPointIncreased) {
            // 포인트가 실제로 증가한 경우 - 확정 메시지 표시
            console.log("백엔드에서 포인트 적립 확인!", {
              isProgressReset,
              isBackendRewarded,
              isPointIncreased,
              lastProgressSec,
              currentProgressSec,
              lastProgressPercentage: lastProgressPercentage.toFixed(1),
              progressPercentage: progressPercentage.toFixed(1),
              lastTodayPoint,
              currentTodayPoint,
            });

            setShowPendingMessage(false); // 임시 메시지 제거
            setShowRewardMessage(true); // 확정 메시지 표시
            setTimeout(() => {
              setShowRewardMessage(false);
            }, 3000); // 3초 후 메시지 숨김
          } else {
            // 포인트가 증가하지 않은 경우 - 임시 메시지만 제거
            console.log("포인트 적립 실패 - 임시 메시지 제거");
            setShowPendingMessage(false);
          }
        } else if (
          (isProgressReset || isBackendRewarded || isPointIncreased) &&
          isPointIncreased
        ) {
          // 임시 메시지 없이 백엔드에서 직접 포인트 획득 감지 (기존 로직)
          console.log("백엔드에서 포인트 적립 감지!", {
            isProgressReset,
            isBackendRewarded,
            isPointIncreased,
            lastProgressSec,
            currentProgressSec,
            lastProgressPercentage: lastProgressPercentage.toFixed(1),
            progressPercentage: progressPercentage.toFixed(1),
            lastTodayPoint,
            currentTodayPoint,
          });

          setShowRewardMessage(true);
          setTimeout(() => {
            setShowRewardMessage(false);
          }, 3000); // 3초 후 메시지 숨김
        }

        setLastProgressSec(currentProgressSec);
        setPointData(response.data);
        setLastTodayPoint(currentTodayPoint);

        // 하루 한도에 도달했는지 확인
        if (response.data.todayPoint >= response.data.limitPoint) {
          setIsActive(false);
        } else {
          setIsActive(true);
        }
      } catch (error) {
        console.error("시청 시간 업데이트 실패:", error);
      }
    }
  };

  // 비디오 변경 시 로컬 진행률 리셋
  const resetProgress = () => {
    setLocalProgressSec(0);
    setSyncProgressSec(0);
    setLastSyncTime(Date.now());
    setShowPendingMessage(false); // 임시 메시지도 리셋
    setShowRewardMessage(false); // 확정 메시지도 리셋
    console.log("로컬 진행률 리셋");
  };

  // ref를 통해 부모 컴포넌트에서 호출할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    updateWatchTime,
    resetProgress,
  }));

  // 컴포넌트 마운트 시 초기 상태 조회
  useEffect(() => {
    fetchPointStatus();
  }, [customerId]);

  // 부드러운 게이지 애니메이션을 위한 타이머
  useEffect(() => {
    let interval;

    if (isPlaying && isActive) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - lastSyncTime) / 1000; // 경과 시간 (초)
        const newProgress = syncProgressSec + elapsed;

        // 60초 도달 시 임시 메시지 표시 및 게이지 리셋
        if (newProgress >= 60 && localProgressSec < 60) {
          console.log("게이지 60초 도달 - 임시 메시지 표시 및 게이지 리셋");
          setShowPendingMessage(true);

          // 게이지 즉시 리셋 (0부터 다시 차오르기 시작)
          setLocalProgressSec(0);
          setSyncProgressSec(0);
          setLastSyncTime(Date.now());
        } else if (newProgress <= 60) {
          // 60초를 넘지 않도록 제한
          setLocalProgressSec(newProgress);
        }
      }, 100); // 100ms마다 업데이트 (부드러운 애니메이션)
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isActive, lastSyncTime, syncProgressSec, localProgressSec]);

  // 게이지 진행률 계산 (0-100%) - 로컬 진행률을 우선 사용하여 부드러운 애니메이션
  const effectiveProgressSec = localProgressSec || pointData.progressSec || 0;
  const progressPercentage = (effectiveProgressSec / 60) * 100;

  // 디버깅용 콘솔 로그
  console.log("포인트 게이지 상태:", {
    progressSec: pointData.progressSec,
    localProgressSec: localProgressSec,
    effectiveProgressSec: effectiveProgressSec,
    progressPercentage: progressPercentage,
    isActive: isActive,
    todayPoint: pointData.todayPoint,
  });

  // 게이지 색상 결정
  const getGaugeColor = () => {
    if (!isActive) return "#666"; // 비활성화 상태
    return "#d4af37"; // 항상 금색
  };

  return (
    <div className="point-gauge-container">
      {/* 원형 포인트 게이지 */}
      <div className="circular-gauge">
        <svg className="gauge-svg" viewBox="0 0 100 100">
          {/* 배경 원 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="8"
          />
          {/* 진행 원 (시계방향) */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getGaugeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${
              2 * Math.PI * 45 * (1 - progressPercentage / 100)
            }`}
            transform="rotate(-90 50 50)"
            className="progress-circle"
          />
        </svg>

        {/* 클로버 아이콘 */}
        <div className="gauge-icon">
          <i className="fas fa-clover" style={{ color: getGaugeColor() }} />
        </div>
      </div>

      {/* 포인트 획득 메시지 */}
      {showPendingMessage && (
        <div className="reward-message pending">포인트 적립 중...</div>
      )}
      {showRewardMessage && (
        <div className="reward-message success">포인트 10p 적립!</div>
      )}
    </div>
  );
});

PointGauge.displayName = "PointGauge";

export default PointGauge;
