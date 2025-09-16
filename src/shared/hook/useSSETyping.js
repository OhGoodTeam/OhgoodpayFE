import { useState, useEffect } from 'react';

// SSE로 스트리밍되는 텍스트를 처리하는 훅
// TODO : MVP는 CSS의 TEXT 이벤트로 진행, 차후 SSE로 변경 예정이라 미리 틀만 뽑아둠.
export const useSSETyping = (eventSource, messageId) => {
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!eventSource || !messageId) return;

    setIsStreaming(true);
    setStreamedText('');
    setIsComplete(false);

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.messageId === messageId) {
        if (data.type === 'text_chunk') {
          setStreamedText(prev => prev + data.content);
        } else if (data.type === 'complete') {
          setIsStreaming(false);
          setIsComplete(true);
        }
      }
    };

    const handleError = (event) => {
      console.error('SSE Error:', event);
      setIsStreaming(false);
      setIsComplete(true);
    };

    eventSource.addEventListener('message', handleMessage);
    eventSource.addEventListener('error', handleError);

    return () => {
      eventSource.removeEventListener('message', handleMessage);
      eventSource.removeEventListener('error', handleError);
    };
  }, [eventSource, messageId]);

  return {
    streamedText,
    isStreaming,
    isComplete
  };
};

// SSE EventSource를 관리하는 훅
export const useSSEConnection = (url) => {
  const [eventSource, setEventSource] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const connect = () => {
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource(url);

    newEventSource.onopen = () => {
      setConnectionStatus('connected');
    };

    newEventSource.onerror = () => {
      setConnectionStatus('error');
    };

    setEventSource(newEventSource);
  };

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setConnectionStatus('disconnected');
    }
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  return {
    eventSource,
    connectionStatus,
    connect,
    disconnect
  };
};