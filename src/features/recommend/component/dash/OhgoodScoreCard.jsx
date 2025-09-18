import React, { useEffect, useState } from "react";
import Card from "./Card";
import "./OhgoodScoreCard.css";
import useOhgoodScoreStore from "../../../../shared/store/useOhgoodScoreStore";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import sample from "../../../../mocks/ohgood-score.sample.json";

// DEV 스위치(필요하면 .env에 VITE_USE_MOCK_SCORE=false로 끌 수 있음)
const USE_MOCK_SCORE =
  import.meta.env.DEV && (import.meta.env.VITE_USE_MOCK_SCORE ?? "true") === "true";

const clampPct = (s) =>
  Math.max(0, Math.min(100, Math.round((Number(s || 0) / 1000) * 100)));

/** "지금 ___님의 오굿스코어는" 패턴에서 ___ 만 하이라이트 */
const highlightName = (msg) => {
  if (!msg) return null;
  const re = /(지금\s*)(.+?)(님의\s*오굿스코어는)/;
  const m = msg.match(re);
  if (!m) return msg; // 패턴이 없으면 원문 그대로
  const [, pre, name, post] = m;
  const head = msg.slice(0, m.index);
  const tail = msg.slice(m.index + m[0].length);
  return (
    <>
      {head}
      {pre}
      <strong className="score-name gradient">{name}</strong>
      {post}
      {tail}
    </>
  );
};

/** '!' 기준으로 줄바꿈 + 첫 문장에만 이름 하이라이트 적용 */
const renderByBang = (msg) => {
  if (!msg) return null;
  const parts = String(msg).split("!");
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i === 0 ? highlightName(part.trim()) : part.trim()}
      {i < parts.length - 1 && "!"}
      {i < parts.length - 1 && <br />}
    </React.Fragment>
  ));
};

const OhgoodScoreCard = ({ customerId = 1 }) => {
  const { score, message, loading, fetchScore } = useOhgoodScoreStore(); //setFromResponse - mock 활용시 설정

  // 데이터 가져오기 (DEV=mock, PROD=실제)
  useEffect(() => {
    // if (score > 0) return; // 값 있으면 재요청 X
    // if (USE_MOCK_SCORE) setFromResponse(sample);
    fetchScore(customerId);
  }, [customerId, fetchScore]); // score, setFromResponse

  // 게이지 느리게 채우기용 로컬 state
  const pct = clampPct(score);
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimPct(pct)); // 0 → 목표값
    return () => cancelAnimationFrame(id);
  }, [pct]);

  if (loading) {
    return (
      <Card className="ohgood-score-card loading">
        <div className="loading-text">로딩 중...</div>
      </Card>
    );
  }

  return (
    <Card className="ohgood-score-card">
      {/* 게이지 그라디언트 */}
      <svg width="0" height="0" aria-hidden>
        <defs>
          <linearGradient id="og-gradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="gauge-box">
        <CircularProgressbarWithChildren
          value={animPct}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: "url(#og-gradient)",
            trailColor: "#E5E7EB",
            strokeLinecap: "round",
            // 애니메이션 속도 (초) - 필요하면 1.2~2.0 사이로 조절
            pathTransitionDuration: 1.6,
          })}
        >
          <div className="gauge-number">{score}</div>
        </CircularProgressbarWithChildren>
      </div>

      <div className="score-copy">
        <p className="score-oneliner">
          {renderByBang(message || `오굿스코어 ${score}점`)}
        </p>
      </div>
    </Card>
  );
};

export default OhgoodScoreCard;