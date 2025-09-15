import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../shared/api/axiosInstance";
import "../css/Roulette.css";

const Roulette = ({ duration = 3500 }) => {
  const [spin, setSpin] = useState(false);
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [sectors] = useState(["5p", "10p", "20p", "30p", "40p", "50p"]);
  const wheelRef = useRef(null);

  useEffect(() => {
    // 마운트될 때 오늘 출석 여부 확인
    axiosInstance.get(`/api/checkin/today?customerId=1`)
      .then(res => {
        if (res.data === true) {
          setDisabled(true);
          setShowModal(true); // 이미 출석했으면 모달에서 바로 "오늘 출석 완료" 표시
        }
      })
      .catch(err => console.error(err));
  }, []);

  // 룰렛 돌리기
  const spinRoulette = () => {
    if (spin || disabled) return;
    setSpin(true);

    // 랜덤 각도 계산
    const randomDeg = 360 * 5 + Math.floor(Math.random() * 360);
    wheelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
    wheelRef.current.style.transform = `rotate(${randomDeg}deg)`;

    setTimeout(() => {
      const sectorAngle = 360 / sectors.length;
      const finalDeg = randomDeg % 360;
      const winningIndex = Math.floor((sectors.length - finalDeg / sectorAngle) % sectors.length);

      const pointStr = sectors[winningIndex];  // 예: "20p"
      const point = parseInt(pointStr);        // 숫자만 추출: 20

      setResult(pointStr);
      setSpin(false);
      setShowModal(true);

      axiosInstance.post(`/api/checkin/roulette?point=${point}`)
        .then(() => setDisabled(true)) // 출석 체크 완료 후 버튼 비활성화
        .catch(err => console.error(err));
    }, duration);
  };

  const radius = 140;
  const center = 160;
  const angle = 360 / sectors.length;

  return (
    <div className="roulette_container">
      <div className="roulette_wrapper">
        <div className="pointer">▼</div>

        <svg width="320" height="320" viewBox="0 0 320 320" ref={wheelRef}>
          <g transform={`translate(${center},${center})`}>
            {sectors.map((sector, i) => {
              const startAngle = angle * i;
              const endAngle = startAngle + angle;
              const largeArc = endAngle - startAngle > 180 ? 1 : 0;

              const start = polarToCartesian(radius, startAngle);
              const end = polarToCartesian(radius, endAngle);

              const pathData = [
                `M 0 0`,
                `L ${start.x} ${start.y}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
                `Z`
              ].join(" ");

              const textAngle = startAngle + angle / 2;
              const textPos = polarToCartesian(radius / 1.5, textAngle);

              return (
                <g key={i}>
                  <path className={`sector_path ${i % 2 === 0 ? "even" : "odd"}`} d={pathData} />
                  <text
                    className="sector_text_svg"
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textPos.x}, ${textPos.y})`}
                  >
                    {sector}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <button className="center_btn" onClick={spinRoulette} disabled={disabled}>
          <span className="btn_line1">Start</span>
          <span className="btn_line2">시작!</span>
        </button>
      </div>

      {showModal && (
        <div className="roulette-result">
          <p>
            {disabled && result === "" 
              ? "오늘 출석 완료! 내일 또 출석해주세요😊" 
              : `축하합니다! ${result} 당첨!`}
          </p>
        </div>
      )}
    </div>
  );
};

function polarToCartesian(radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians)
  };
}

export default Roulette;
