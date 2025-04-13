import Redis from "ioredis";
import mongoose from "mongoose"; // TODO
import { generateAIResponse } from "../gemini.service.js";

export class ChatRoom {
  constructor(groupId) {
    this.groupId = groupId;
    this.redisPub = new Redis();
    this.redisSub = new Redis();

    this.users = [];

    this.messageBroadcast();
  }

  addUser(socket) {
    this.users.push(socket);
    this.addHandler(socket);
    socket.on("close", () => {
      this.removeUser(socket);
    });
  }

  removeUser(socket) {
    this.users = this.users.filter((user) => user !== socket);
  }

  addHandler(socket) {
    socket.on("message", (message) => {
      this.redisPub.publish(this.groupId, message);
      try {
        const data = JSON.parse(message);
        if (data.message.startsWith("@ai")) {
          const prompt = data.message.substring(3).trim();
          generateAIResponse(prompt, this.groupId); // Implement this function to generate AI response
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });
  }

  messageBroadcast() {
    this.redisSub.subscribe(this.groupId, (err) => {
      if (err) {
        console.error("Failed to subscribe to Redis channel:", err);
      } else {
        console.log(`Subscribed to Redis channel: ${this.groupId}`);
      }
    });
    this.redisSub.on("message", (channel, message) => {
      try {
        const data = JSON.parse(message);

        this.users.forEach((socket) => {
          if (socket.user.userId !== data.userId) {
            socket.send(message);
          }
        });
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });
  }
}
