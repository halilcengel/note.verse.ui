import { useState, useEffect, useRef } from 'react';

export const useSSE = (url) => {
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    const connect = () => {
      try {
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          if (event.data === '[DONE]') {
            eventSource.close();
            setIsConnected(false);
            return;
          }

          try {
            const data = JSON.parse(event.data);
            setEvents((prev) => [...prev, data]);
          } catch (err) {
            console.error('Failed to parse SSE data:', err);
          }
        };

        eventSource.onerror = (err) => {
          console.error('SSE error:', err);
          setError('Connection error occurred');
          setIsConnected(false);
          eventSource.close();
        };
      } catch (err) {
        setError(err.message);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    };
  }, [url]);

  const clearEvents = () => {
    setEvents([]);
  };

  return { events, isConnected, error, clearEvents };
};
