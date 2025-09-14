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
  const [localProgressSec, setLocalProgressSec] = useState(0);
  const [currentShortsId, setCurrentShortsId] = useState(null);
  const [lastProgressSec, setLastProgressSec] = useState(0);

  // 포인트 상태 조회
  const fetchPointStatus = async () => {
    try {
      const response = await axiosInstance.get("/api/shorts/pointstatus", {
        params: { customerId },
      });
      console.log("포인트 상태 조회 응답:", response.data);
      setPointData(response.data);
      setLastProgressSec(response.data.progressSec);

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

    if (!isActive) {
      console.log("게이지 비활성화:", { isActive });
      return;
    }

    // 재생 중일 때만 로컬 진행률 업데이트 (백엔드 응답이 늦을 때를 위한 보조)
    if (isPlaying) {
      // 프론트엔드에서 로컬 진행률 업데이트 (즉시 UI 반영)
      setLocalProgressSec((prev) => {
        const newProgress = prev + 1;
        console.log("로컬 진행률 업데이트:", newProgress);
        return newProgress;
      });
    } else {
      console.log("비디오 일시정지, 진행률 업데이트 중단");
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
          }
        );

        // 2. 그 다음 GET /api/shorts/pointstatus로 최신 상태 조회
        const response = await axiosInstance.get("/api/shorts/pointstatus", {
          params: { customerId },
        });

        console.log("포인트 상태 응답:", response.data);

        // 60초 완료 감지 (더 유연한 감지 로직)
        const currentProgressSec = response.data.progressSec;
        const progressPercentage = (currentProgressSec / 60) * 100;
        const lastProgressPercentage = (lastProgressSec / 60) * 100;

        // 조건 1: 이전 진행률이 50% 이상이고 현재가 10% 미만이면 한 바퀴 완료
        // 조건 2: 백엔드에서 isRewarded가 true인 경우
        const isProgressReset =
          lastProgressPercentage >= 50 && progressPercentage < 10;
        const isBackendRewarded = response.data.isRewarded;

        if (isProgressReset || isBackendRewarded) {
          console.log("포인트 획득 감지!", {
            isProgressReset,
            isBackendRewarded,
            lastProgressSec,
            currentProgressSec,
            lastProgressPercentage: lastProgressPercentage.toFixed(1),
            progressPercentage: progressPercentage.toFixed(1),
          });
          setShowRewardMessage(true);
          setTimeout(() => {
            setShowRewardMessage(false);
          }, 3000); // 3초 후 메시지 숨김
        }

        setLastProgressSec(currentProgressSec);
        setPointData(response.data);

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

  // 게이지 진행률 계산 (0-100%) - 백엔드 진행률을 우선 사용, 로컬 진행률은 보조
  const effectiveProgressSec = pointData.progressSec || localProgressSec;
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
      {showRewardMessage && (
        <div className="reward-message">포인트 10p 적립!</div>
      )}
    </div>
  );
});

PointGauge.displayName = "PointGauge";

export default PointGauge;
