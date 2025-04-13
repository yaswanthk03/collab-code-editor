import "dotenv/config.js";

import http from "http";
import app from "./app.js";
import { WebSocketServer } from "ws";
import { authMiddlewareForWebSocket } from "./middleware/auth.middleware.js";
import { UserManager } from "./services/ws/userManager.js";
import { GroupChatManager } from "./services/ws/groupChatManager.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const mainConnection = new WebSocketServer({ noServer: true });
const chatRooms = new WebSocketServer({ noServer: true });

const userManager = new UserManager();
const groupChatManager = new GroupChatManager();

mainConnection.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Handle incoming messages from the main connection
    // You can broadcast this message to other clients if needed
  });
  console.log("Client connected to the main connection", ws.user);

  userManager.addUser(ws.user.userId, ws);

  ws.on("close", () => {
    userManager.removeUser(ws.user.userId);
    console.log("Client disconnected from the main connection");
  });
});

chatRooms.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message in chat room: ${message}`);
    // Handle incoming messages from the chat room
    // You can broadcast this message to other clients in the chat room if needed
  });
  console.log("Client connected to the chat room", ws.groupId);
  groupChatManager.addToGroupChat(ws.groupId, ws);
  ws.on("close", () => {
    groupChatManager.removeFromGroupChat(ws.groupId, ws);
    console.log("Client disconnected from the chat room");
  });
});

server.on("upgrade", async (request, socket, head) => {
  try {
    await authMiddlewareForWebSocket(request);
  } catch (error) {
    socket.write(`HTTP/1.1 401 ${error.message}\r\n\r\n`);
    socket.destroy();
  }
  console.log("User:", request.user, request.url);
  if (request.url === "/") {
    mainConnection.handleUpgrade(request, socket, head, (ws) => {
      ws.user = request.user;
      mainConnection.emit("connection", ws, request);
    });
  } else if (request.url.startsWith("/chat/")) {
    const groupId = request.url.split("/")[2];

    chatRooms.handleUpgrade(request, socket, head, (ws) => {
      ws.user = request.user;
      ws.groupId = groupId;
      chatRooms.emit("connection", ws, request);
    });
  }
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
