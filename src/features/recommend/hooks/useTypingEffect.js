import { useState, useEffect } from 'react';

// SSE 도입 전, 타이핑 효과를 위한 훅
export const useTypingEffect = (
  text,
  speed = 50,
  isTyping = true,
  onComplete = null
) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isTyping || !text) {
      setDisplayedText(text || '');
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;

    const typeText = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    const interval = setInterval(typeText, speed);

    return () => clearInterval(interval);
  }, [text, speed, isTyping, onComplete]);

  return {
    displayedText,
    isComplete,
    isTyping: isTyping && !isComplete
  };
};