import { useState, forwardRef, useImperativeHandle } from "react";
import axiosInstance from "../../../../shared/api/axiosInstance";
import "../../css/PointGauge.css";
import callToken from "../../../../shared/hook/callToken";

const PointGauge = forwardRef((props, ref) => {
  // 영상별 포인트 게이지 상태
  const [videoGauges, setVideoGauges] = useState({}); // shortsId를 키로 하는 객체
  const [currentShortsId, setCurrentShortsId] = useState(null);
  const [showRewardMessage, setShowRewardMessage] = useState(false);
  const [showPendingMessage, setShowPendingMessage] = useState(false);
  const [showLimitExceededMessage, setShowLimitExceededMessage] =
    useState(false);
  const [showLoginRequiredMessage, setShowLoginRequiredMessage] =
    useState(false);
  const [rewardedPoints, setRewardedPoints] = useState(0);
  const [todayTotalPoints, setTodayTotalPoints] = useState(0);
  const [dailyLimit] = useState(100); // 일일 한도
  const [isLimitReached, setIsLimitReached] = useState(false);

  // 로그인 상태 확인 함수
  const isLoggedIn = () => {
    const token = sessionStorage.getItem("accessToken");
    return !!token;
  };

  // 영상별 게이지 초기화
  // const initializeVideoGauge = (shortsId, videoDuration) => {
  //   if (!videoGauges[shortsId]) {
  //     const requiredWatchTime = Math.max(1, videoDuration - 1); // 최소 1초
  //     setVideoGauges((prev) => ({
  //       ...prev,
  //       [shortsId]: {
  //         watchedSeconds: 0,
  //         requiredSeconds: requiredWatchTime,
  //         isCompleted: false,
  //         isEarning: false,
  //         lastUpdateTime: Date.now(),
  //       },
  //     }));
  //   }
  // };

  // 포인트 적립 요청
  const earnPoints = async (shortsId, watchedSeconds) => {
    // 로그인하지 않았으면 메시지만 표시하고 리턴
    if (!isLoggedIn()) {
      setShowPendingMessage(false);
      setShowRewardMessage(false);
      setShowLimitExceededMessage(false);

      // "로그인 후 적립가능합니다" 메시지 표시
      setShowLoginRequiredMessage(true);
      setTimeout(() => {
        setShowLoginRequiredMessage(false);
      }, 3000);
      return; // 백엔드로 요청 안 보냄
    }

    try {
      setShowPendingMessage(true);

      const response = await axiosInstance.post("/api/shorts/point/earn", {
        watchedSeconds,
        shortsId,
      });

      if (response.data.success) {
        setRewardedPoints(response.data.earnedPoints);
        setTodayTotalPoints(response.data.todayTotalPoints);
        setShowPendingMessage(false);
        setShowRewardMessage(true);

        // 일일 한도 달성 확인
        if (response.data.todayTotalPoints >= dailyLimit) {
          setIsLimitReached(true);
        }

        // 해당 영상 게이지를 초기화 (다시 볼 수 있게)
        setVideoGauges((prev) => ({
          ...prev,
          [shortsId]: {
            ...prev[shortsId],
            watchedSeconds: 0,
            isCompleted: false,
            isEarning: false,
            lastUpdateTime: Date.now(),
          },
        }));

        setTimeout(() => {
          setShowRewardMessage(false);
        }, 3000);
      } else {
        setShowPendingMessage(false);
        // 한도 초과로 인한 실패인지 확인
        if (response.data.todayTotalPoints >= dailyLimit) {
          setIsLimitReached(true);
          setTodayTotalPoints(response.data.todayTotalPoints);

          // "오늘 포인트 한도초과" 메시지 3초간 표시
          setShowLimitExceededMessage(true);
          setTimeout(() => {
            setShowLimitExceededMessage(false);
          }, 3000);
        }
      }
    } catch (error) {
      setShowPendingMessage(false);
      console.error("포인트 적립 요청 실패:", error);
    }
  };

  // 시청 시간 업데이트
  const updateWatchTime = (shortsId, isPlaying, videoDuration) => {
    // 영상이 변경되었을 때 - 무조건 게이지 초기화
    if (currentShortsId !== shortsId) {
      setCurrentShortsId(shortsId);

      // 무조건 게이지 초기화 (기존 게이지가 있어도)
      setVideoGauges((prev) => ({
        ...prev,
        [shortsId]: {
          watchedSeconds: 0,
          requiredSeconds: Math.max(1, videoDuration - 1),
          isCompleted: false,
          isEarning: false,
          lastUpdateTime: Date.now(),
        },
      }));

      return; // 초기화 후 바로 리턴
    }

    // 일일 한도 달성 시 게이지 업데이트 중단
    if (isLimitReached || todayTotalPoints >= dailyLimit) {
      return;
    }

    // 재생 중일 때만 게이지 업데이트
    if (isPlaying && videoGauges[shortsId]) {
      const now = Date.now();
      const gauge = videoGauges[shortsId];

      // 0.1초씩 증가 (실제 경과 시간과 상관없이)
      const increment = 0.1;
      const newWatchedSeconds = Math.min(
        gauge.watchedSeconds + increment,
        gauge.requiredSeconds
      );

      setVideoGauges((prev) => ({
        ...prev,
        [shortsId]: {
          ...prev[shortsId],
          watchedSeconds: newWatchedSeconds,
          lastUpdateTime: now,
        },
      }));

      // 필요한 시청 시간에 도달했을 때 포인트 적립 요청
      if (newWatchedSeconds >= gauge.requiredSeconds && !gauge.isEarning) {
        setVideoGauges((prev) => ({
          ...prev,
          [shortsId]: {
            ...prev[shortsId],
            isEarning: true,
          },
        }));
        if (callToken() != null) {
          earnPoints(shortsId, Math.round(newWatchedSeconds));
        }
      }
    }
  };

  // 영상 변경 시 게이지 초기화
  const resetVideoGauge = (shortsId) => {
    if (videoGauges[shortsId]) {
      // 기존 게이지가 있으면 초기화
      setVideoGauges((prev) => ({
        ...prev,
        [shortsId]: {
          ...prev[shortsId],
          watchedSeconds: 0,
          isCompleted: false,
          isEarning: false,
          lastUpdateTime: Date.now(),
        },
      }));
    } else {
      // 게이지가 없으면 기본값으로 생성
      setVideoGauges((prev) => ({
        ...prev,
        [shortsId]: {
          watchedSeconds: 0,
          requiredSeconds: 10, // 기본값, updateWatchTime에서 실제 값으로 업데이트됨
          isCompleted: false,
          isEarning: false,
          lastUpdateTime: Date.now(),
        },
      }));
    }
  };

  // ref를 통해 부모 컴포넌트에서 호출할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    updateWatchTime,
    resetVideoGauge,
  }));

  // 현재 영상의 게이지 정보 가져오기
  const getCurrentGauge = () => {
    if (!currentShortsId || !videoGauges[currentShortsId]) {
      return { watchedSeconds: 0, requiredSeconds: 1, isCompleted: false };
    }
    return videoGauges[currentShortsId];
  };

  // 게이지 진행률 계산 (0-100%)
  const getCurrentProgress = () => {
    const gauge = getCurrentGauge();
    return Math.min((gauge.watchedSeconds / gauge.requiredSeconds) * 100, 100);
  };

  // 게이지 색상 결정
  const getGaugeColor = () => {
    if (isLimitReached || todayTotalPoints >= dailyLimit) return "#666"; // 일일 한도 달성 - 회색
    return "#d4af37"; // 기본 - 금색
  };

  // 게이지 활성화 상태 확인 (로그인했을 때만 활성화)
  const isGaugeActive = () => {
    return isLoggedIn() && !isLimitReached && todayTotalPoints < dailyLimit;
  };

  const progressPercentage = getCurrentProgress();
  // const gauge = getCurrentGauge();

  return (
    <div
      className={`point-gauge-container ${!isGaugeActive() ? "disabled" : ""}`}
    >
      {/* 원형 포인트 게이지 */}
      <div className="circular-gauge">
        <svg className="gauge-svg" viewBox="0 0 100 100">
          {/* 배경 원 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={
              isGaugeActive()
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(255, 255, 255, 0.1)"
            }
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
            className={`progress-circle ${!isGaugeActive() ? "disabled" : ""}`}
          />
        </svg>

        {/* 클로버 아이콘 */}
        <div className={`gauge-icon ${!isGaugeActive() ? "disabled" : ""}`}>
          <i className="fas fa-clover" style={{ color: getGaugeColor() }} />
        </div>

        {/* 비활성화 상태 표시 */}
        {!isGaugeActive() && (
          <div className="gauge-disabled-overlay">
            <i className="fas fa-ban" />
          </div>
        )}
      </div>

      {/* 포인트 획득 메시지 */}
      {showLoginRequiredMessage && (
        <div className="reward-message login-required">
          로그인 후 적립가능합니다
        </div>
      )}
      {showPendingMessage && (
        <div className="reward-message pending">포인트 적립 중...</div>
      )}
      {showRewardMessage && (
        <div className="reward-message success">{rewardedPoints}p 적립!</div>
      )}
      {showLimitExceededMessage && (
        <div className="reward-message limit-exceeded">
          오늘 포인트 한도초과
        </div>
      )}
    </div>
  );
});

PointGauge.displayName = "PointGauge";

export default PointGauge;
