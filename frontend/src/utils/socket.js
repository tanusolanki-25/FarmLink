import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false, // hum khud connect karenge, token ke saath
});

export default socket;