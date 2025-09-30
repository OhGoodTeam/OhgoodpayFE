import { useState, useEffect, useRef } from 'react';
import './ChatToggle.css';

const ChatToggle = ({
  options,
  activeToggle,
  onToggleClick,
  disabled = false
}) => {
  const [animatingOptions, setAnimatingOptions] = useState([]);
  const prevOptionsRef = useRef();

  // options가 실제로 변경될 때만 애니메이션 트리거
  useEffect(() => {
    // 이전 options와 현재 options가 실제로 다른지 확인
    const optionsChanged = !prevOptionsRef.current ||
      prevOptionsRef.current.length !== options.length ||
      !prevOptionsRef.current.every((option, index) => option === options[index]);

    if (options.length > 0 && optionsChanged) {
      setAnimatingOptions([]);
      prevOptionsRef.current = [...options];

      const delay = 100;

      // 각 버튼을 순차적으로 애니메이션 (첫 등장용)
      options.forEach((option, index) => {
        setTimeout(() => {
          setAnimatingOptions(prev => [...prev, option]);
        }, index * delay);
      });
    }
  }, [options]);

  // 옵션이 없으면 렌더링하지 않음
  if (!options || options.length === 0) {
    return null;
  }


  console.log('ChatToggle 렌더링 - options:', options.length, 'disabled:', disabled);

  return (
    <div className="toggle-container">
      {options.map((option, index) => (
        <button
          key={option}
          className={`toggle-btn ${
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