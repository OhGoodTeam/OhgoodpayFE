import { useState, useEffect } from 'react';
import './ChatToggle.css';

const ChatToggle = ({
  options,
  activeToggle,
  onToggleClick,
  disabled = false
}) => {
  const [animatingOptions, setAnimatingOptions] = useState([]);

  // options가 변경될 때 애니메이션 트리거
  useEffect(() => {
    if (options.length > 0) {
      setAnimatingOptions([]);

      // 각 버튼을 순차적으로 애니메이션
      options.forEach((option, index) => {
        setTimeout(() => {
          setAnimatingOptions(prev => [...prev, option]);
        }, index * 100); // 100ms 간격으로 빠르게
      });
    }
  }, [options]);

  // 옵션이 없으면 렌더링하지 않음
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="toggle-container">
      {options.map((option, index) => (
        <button
          key={option}
          className={`toggle-btn ${activeToggle === option ? 'active' : ''} ${
            animatingOptions.includes(option) ? 'slide-in' : 'slide-out'
          }`}
          onClick={() => !disabled && onToggleClick(option)}
          disabled={disabled}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChatToggle;