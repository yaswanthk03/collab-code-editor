import Redis from "ioredis";

export class UserMain {
  constructor(userId, socket) {
    this.userId = userId;
    this.socket = socket;
    this.redisPub = new Redis();
    this.redisSub = new Redis();

    this.receiveMessage();

    this.friends = [];
    this.liveFriends = [];
    this.addLiveFriends();

    this.addHandler();
  }

  async receiveMessage() {
    this.redisSub.subscribe(this.userId, (err) => {
      if (err) {
        console.error("Failed to subscribe to Redis channel:", err);
      } else {
        console.log(`Subscribed to Redis channel: ${this.userId}`);
      }
    });
    this.redisSub.on("message", (channel, message) => {
      console.log(`Received message from channel ${channel}: ${message}`);
      this.socket.send(message);
    });
  }
  async addLiveFriends() {
    // TODO: Implement adding live friends after adding friends to user model
    // this.friends = mongoose.model("User").findById(this.userId).populate("friends");
    // this.liveFriends = await redis.get(this.userId);
  }
  addHandler() {
    this.socket.on("message", (message) => {
      // if (type === "add-friend") {
      //   const { friendId } = message;

      //   const newMessage = {
      //     type: "add-friend",
      //     message: {
      //       friendId: this.userId,
      //       message: "You have a new friend request",
      //     },
      //   };

      //   this.redisPub.publish(friendId, newMessage);
      // } else if (type === "update") {
      //   // TODO
      // }
      console.log(`Received message: ${message}`);
    });
  }
}
