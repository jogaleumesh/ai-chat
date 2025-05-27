import { useEffect, useRef } from "react";

export function useWebSocket(onMessage: (msg: string) => void) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onmessage = (event) => {
      onMessage(event.data);
    };

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    return () => {
      ws.current?.close();
    };
  }, [onMessage]);

  const sendMessage = (message: string) => {
    if (!ws.current) return;

    // Check WebSocket connection state
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      // Retry after small delay if not ready
      const interval = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(message);
          clearInterval(interval);
        }
      }, 100); // Retry every 100ms
    }
  };

  return { sendMessage };
}
