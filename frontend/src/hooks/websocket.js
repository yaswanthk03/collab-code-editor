import { useEffect, useState } from "react";

export const useSocket = (groupChatId) => {
  const WS_URL = "ws://localhost:3000";
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/chat/${groupChatId}`, [
      "Sec-WebSocket-Protocol",
      localStorage.getItem("token"),
    ]);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(JSON.stringify({ message: "Ping" }));
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [groupChatId, localStorage.getItem("token")]);

  return socket;
};
