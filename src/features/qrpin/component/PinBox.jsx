import { useState } from "react";
import "../css/PinBox.css";

const PinBox = () => {
  const MAX_LENGTH = 6;
  const [pin, setPin] = useState("");
  const [active, setActive] = useState(false);

  const handleNumberClick = (num) => {
    if (pin.length < MAX_LENGTH) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleToggle = () => {
    setActive((prev) => !prev);
  };

  return (
    <div className="pin-wrapper">
      {/* 핀 박스 */}
      <div
        className={`pin-box ${active ? "active" : ""}`}
        onClick={handleToggle}
      >
        <span className="pin-placeholder">결제 코드를 입력해주세요.</span>
        <div className="pin-dots">
          {Array.from({ length: MAX_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? "filled" : ""}`}
            ></div>
          ))}
        </div>
      </div>

      {/* 숫자패드 */}
      {active && (
        <div className="number-pad-container">
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num)}>
                {num}
              </button>
            ))}
            <div className="empty-cell"></div>
            <button onClick={() => handleNumberClick(0)}>0</button>
            <button onClick={handleDelete}>←</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinBox;
