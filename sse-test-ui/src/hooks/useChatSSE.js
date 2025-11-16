import { useState, useRef } from 'react';

export const useChatSSE = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = async (endpoint, payload, onEvent, onComplete) => {
    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();
    let completedCalled = false;

    const callComplete = () => {
      if (!completedCalled && onComplete) {
        completedCalled = true;
        onComplete();
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsLoading(false);
          callComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              setIsLoading(false);
              callComplete();
              reader.cancel();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (onEvent) onEvent(parsed);
            } catch (err) {
              console.error('Failed to parse SSE data:', err, data);
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Chat SSE error:', err);
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  const cancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error, cancel };
};
