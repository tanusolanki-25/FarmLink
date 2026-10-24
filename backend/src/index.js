import "dotenv/config";
import http from "http"
import jwt from "jsonwebtoken"
import { Server } from "socket.io";
import { app } from "./app.js";

const server = http.createServer(app)

const io = new Server(server, {
  cors: {origin: process.env.CORS_ORIGIN}
})

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));

  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id, socket.user.role);

  socket.on("join-center", (centerId) => {
    socket.join(`center-${centerId}`);
    console.log(`${socket.id} joined center-${centerId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.set("io", io);

server.listen(process.env.PORT, ()=>{
  console.log(`server is running at port:${process.env.PORT}`)
})