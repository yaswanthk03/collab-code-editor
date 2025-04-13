import { ChatRoom } from "./chatRoom.js";

export class GroupChatManager {
  constructor() {
    this.groupChats = new Map();
  }

  addToGroupChat(groupId, socket) {
    if (!this.groupChats.has(groupId)) {
      const chatRoom = new ChatRoom(groupId);

      this.groupChats.set(groupId, chatRoom);
    }

    this.groupChats.get(groupId).addUser(socket);
  }

  removeFromGroupChat(groupId, socket) {
    if (this.groupChats.has(groupId)) {
      const groupChat = this.groupChats.get(groupId);
      groupChat.removeUser(socket);
      if (groupChat.users.length === 0) {
        this.groupChats.delete(groupId);
      }
    }
  }
}
