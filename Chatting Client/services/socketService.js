import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io("http://your-backend-url", {
      auth: { token },
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return this.socket;
  }

  setUserOnline(userId) {
    if (this.socket) {
      this.socket.emit("user-online", userId);
    }
  }

  listenOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on("online-users-update", callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
