import { UserMain } from "./userMain.js";

export class UserManager {
  constructor() {
    this.users = new Map();
  }

  addUser(userId, socket) {
    const user = new UserMain(userId, socket);
    this.users.set(userId, user);
  }

  removeUser(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.redisSub.unsubscribe(userId);
      user.redisPub.quit();
      user.redisSub.quit();
    }
    this.users.delete(userId);
  }

  getUserSocket(userId) {
    return this.users.get(userId);
  }

  getAllUsers() {
    return Array.from(this.users.keys());
  }
}
