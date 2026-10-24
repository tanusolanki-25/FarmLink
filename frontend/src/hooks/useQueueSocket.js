import { useEffect } from "react";
import socket from "../utils/socket";

export default function useQueueSocket(centerId, onUpdate) {
  useEffect(() => {
    if (!centerId) return;

    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();

    // "connect" pe join karo, taaki reconnect hone par bhi room dobara join ho
    const joinRoom = () => socket.emit("join-center", centerId);
    socket.on("connect", joinRoom);

    socket.on("queue-updated", (data) => {
      if (String(data.centerId) === String(centerId)) onUpdate(data);
    });

    socket.on("connect_error", (err) => console.log("Socket error:", err.message));

    return () => {
      socket.off("connect", joinRoom);
      socket.off("queue-updated");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [centerId]);
}