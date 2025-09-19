// features/recommend/component/dash/AIAdviceCard.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Card from "./Card";
import "./AIAdviceCard.css";
import useAIAdviceStore from "../../../../shared/store/useAIAdviceStore";
import sample from "../../../../mocks/ai-advice.sample.json";

// DEV/PROD 분기 (Vite)
const USE_MOCK = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AI_ADVICE === "true";

const iconFor = (id) => {
  if (!id) return "💡";
  const k = id.toLowerCase();
  if (k.includes("spending")) return "📊";
  if (k.includes("saving")) return "💡";
  if (k.includes("extension")) return "⏰";
  return "💡";
};

const AIAdviceCard = ({ customerId = 1, onClickAnalyze }) => {
  const { advices, loading, fetchAdvices, setFromResponse, error } = useAIAdviceStore(); // setAdvices - mock 활용시 설정


  // ✅ 단 하나의 effect로 통합: DEV=mock, PROD=실제 API
  useEffect(() => {
    // if (advices?.length > 0) return;    // 이미 있음 → 재호출 방지
    // if (USE_MOCK) setFromResponse(sample);
    // else fetchAdvices(customerId);
    fetchAdvices(customerId);
  }, [advices?.length, customerId, fetchAdvices]); //setFromResponse

  // (선택) 상태 변화 확인용 로그
  useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[AIAdviceCard] advices", advices);
    }
  }, [advices]);

  const items = useMemo(() => {
    return advices?.length
      ? advices
      : [
          {
            id: "advice_offline",
            title: "AI 조언을 불러오지 못했어요",
            body: "네트워크 불안정 또는 서버 점검으로 조언을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요. 연결이 복구되면 최신 소비 데이터를 바탕으로 개인화된 조언을 제공해 드릴게요.",
            level: "LOW",
            tags: ["안내"],
          },
        ];
  }, [advices]);

  const multi = items.length > 1;

  // 캐러셀 상태/로직
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const rAF = useRef(null);

  const clampIndex = useCallback(
    (i) => (items.length ? Math.max(0, Math.min(i, items.length - 1)) : 0),
    [items.length]
  );

  const scrollToIndex = useCallback(
    (i) => {
      const el = trackRef.current;
      if (!el) return;
      const next = clampIndex(i);
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      setIndex(next);
    },
    [clampIndex]
  );

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    if (rAF.current) cancelAnimationFrame(rAF.current);
    rAF.current = requestAnimationFrame(() => {
      const current = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(clampIndex(current));
    });
  }, [clampIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onResize = () => scrollToIndex(index);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, [index, scrollToIndex]);

  const handleNext = () => scrollToIndex(index + 1);
  const handleAnalyze = () => onClickAnalyze?.(items[index]);

  if (loading) {
    return (
      <Card className="ai-advice-card loading">
        <div className="loading-spinner">로딩 중...</div>
      </Card>
    );
  }

  return (
    <Card className="ai-advice-card">
      <header className="ai-advice-header">
        <div className="left-section">
          <div className="ai-icon"><span className="ai-circle">AI</span></div>
          <h2 className="ai-title">AI 조언</h2>
        </div>
        {multi ? (
          <button type="button" className="more-advice-btn" onClick={handleNext}>
            다른 조언 보기
          </button>
        ) : <span className="more-advice-btn disabled"> </span>}
      </header>

      <div className="ai-advice-carousel">
        <div className="carousel-track" ref={trackRef} onScroll={multi ? handleScroll : undefined}>
          {items.map((item, i) => (
            <section className="slide" key={item.id ?? i}>
              <h3 className="slide-title">
                <span className="slide-emoji">{iconFor(item.id)}</span>
                {item.title}
              </h3>
              <p className="slide-body">{item.body}</p>
            </section>
          ))}
        </div>

        <footer className="advice-footer">
          {multi ? (
            <div className="advice-indicator" aria-label="조언 페이지">
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`${i + 1}번째`}
                  className={`indicator-dot ${i === index ? "active" : ""}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          ) : <div />}
        </footer>
      </div>
    </Card>
  );
};

export default AIAdviceCard;