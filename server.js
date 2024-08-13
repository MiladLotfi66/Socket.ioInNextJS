// server.js
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import NameSpaceSocket from "./Socket.io/NameSpaceSocket.js";

console.log("WebSocket server is runned....>");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

/////////////////////io init////////////////////////////////

const InitializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "https://foodroya.liara.run/",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    // سایر event ها و logics
  });

  return io;
};
///////////////////////////////////
app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Initializing WebSocket Server
  const io = InitializeSocket(httpServer); // استفاده از کامپوننت
  NameSpaceSocket(io)
  httpServer.once("error", (err) => {
    console.error(err);
    process.exit(1);
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

