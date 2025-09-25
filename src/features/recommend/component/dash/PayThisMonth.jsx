import React, { useEffect, useMemo, useRef, useState } from "react";
import Card from "./Card";
import "./PayThisMonth.css";
import useBNPLStore from "../../../../shared/store/usePayThisMonthStore";
// import sample from "../../../../mocks/pay-this-month.sample.json";
import { formatKRMonthDay } from "../../util/date"; // 경로는 프로젝트에 맞게

const USE_MOCK =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_MOCK_PAY_THIS_MONTH ?? "true") === "true";

const fmtWon = (n) => Number(n || 0).toLocaleString("ko-KR") + "원";
const fmtShortMan = (n) => {
  const v = Number(n || 0);
  return v % 10000 === 0 ? `${v / 10000}만원` : fmtWon(v);
};

const PayThisMonth = ({ iconSrc, location }) => {
  const {
    loading,
    amount,
    pointsThisMonth, // 이번달 적립 포인트
    items,
    fetchThisMonth,
    setFromResponse,
  } = useBNPLStore();

  // // DEV=mock / PROD=fetch
  // useEffect(() => {
  //   // if (USE_MOCK) setFromResponse(sample);
  //   // else fetchThisMonth(customerId);
  //   fetchThisMonth(customerId);
  // }, [customerId, fetchThisMonth, setFromResponse]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchThisMonth();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchThisMonth, setFromResponse]);

  // ── 세로 티커 상태 ──
  const list = useMemo(() => items ?? [], [items]);
  const [idx, setIdx] = useState(0);
  const [rowH, setRowH] = useState(44); // 1행 높이(px)
  const firstRowRef = useRef(null);
  const timerRef = useRef(null);

  // 행 높이 측정(반응형)
  useEffect(() => {
    const measure = () => setRowH(firstRowRef.current?.offsetHeight || 44);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // 자동 전환 (중복 타이머 방지)
  useEffect(() => {
    if (list.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setIdx((i) => (i + 1) % list.length),
      3000
    );
    return () => clearInterval(timerRef.current);
  }, [list.length]);

  // 호버 시 일시정지/재개
  const onEnter = () => timerRef.current && clearInterval(timerRef.current);
  const onLeave = () => {
    if (list.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setIdx((i) => (i + 1) % list.length),
      3000
    );
  };

  // 데이터가 바뀌면 첫 항목부터
  useEffect(() => {
    setIdx(0);
  }, [list.length]);

  if (loading) {
    return (
      <Card className="bnpl-card loading">
        <div className="loading-text">로딩 중...</div>
      </Card>
    );
  }

  return (
    <Card className={`bnpl-card ${location == "home" ? "location-home" : ""}`}>
      {/* 헤더 */}
      <header className="bnpl-header">
        <div className="left">
          {iconSrc ? (
            <img className="ticket-icon" src={iconSrc} alt="" />
          ) : (
            <span className="ticket">✔️</span>
          )}
          <h3>이번 달 BNPL 이용</h3>
        </div>
      </header>

      {/* 요약: 왼쪽 정렬(세로 쌓기) */}
      <div className="bnpl-summary">
        <div className="total-amount">{fmtShortMan(amount)}</div>
        <p className="points-line">
          이번달 적립 포인트{" "}
          <button className="linklike" type="button">
            {fmtWon(pointsThisMonth ?? 0)}
          </button>
        </p>
      </div>

      {/* 최근 거래 티커 */}
      <div
        className="bnpl-pill"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{ "--row-h": `${rowH}px` }}
      >
        <ul
          className="ticker-list"
          style={{ transform: `translateY(-${idx * rowH}px)` }}
        >
          {list.length === 0 ? (
            <li className="ticker-row" ref={firstRowRef}>
              <div className="row-left">
                <span className="placeholder">이번 달 거래가 없습니다</span>
              </div>
              <div className="row-right" />
            </li>
          ) : (
            list.map((t, i) => (
              <li
                className="ticker-row"
                key={t.id ?? i}
                ref={i === 0 ? firstRowRef : undefined}
              >
                <div
                  className="row-left"
                  title={`${formatKRMonthDay(t.date)} | ${t.merchant}`}
                >
                  <span className="date">{formatKRMonthDay(t.date)}</span>
                  <span className="divider"> | </span>
                  <span className="merchant">{t.merchant}</span>
                </div>
                <div className="row-right">{`- ${fmtWon(t.amount)}`}</div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Card>
  );
};

export default PayThisMonth;
