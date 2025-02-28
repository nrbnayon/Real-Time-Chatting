// services/socketService.js
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.token = null;
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.token = token;

    this.socket = io(this.apiUrl, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log(
        "[SocketService] Connected successfully. Socket ID:",
        this.socket.id
      );
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[SocketService] Disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("[SocketService] Connection error:", error.message);
    });

    this.socket.on("error", (error) => {
      console.error("[SocketService] Socket error:", error);
    });

    return this.socket;
  }

  setUserOnline(userId) {
    if (this.socket) {
      this.socket.emit("user-online", userId);
    } else {
      console.warn(
        "[SocketService] Cannot set user online - socket not connected"
      );
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket?.connected || false;
  }

  // Reconnect if needed
  ensureConnection() {
    if (!this.isConnected() && this.token) {
      return this.connect(this.token);
    }
    return this.socket;
  }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;

// import { io } from "socket.io-client";

// class SocketService {
//   constructor() {
//     this.socket = null;
//     this.token = null;
//     this.apiUrl = process.env.API_URL || "http://localhost:4000";
//   }

//   connect(token) {
//     console.log("[SocketService] Connecting with token:", token);
//     this.token = token;

//     this.socket = io(this.apiUrl, {
//       auth: { token },
//     });

//     this.socket.on("connect", () => {
//       console.log(
//         "[Socket] Connected successfully. Socket ID:",
//         this.socket.id
//       );
//     });

//     this.socket.on("disconnect", () => {
//       console.log("[Socket] Disconnected");
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("[Socket] Connection error:", error.message);
//     });

//     return this.socket;
//   }

//   setUserOnline(userId) {
//     console.log("[SocketService] Setting user online - User ID:", userId);
//     if (this.socket) {
//       this.socket.emit("user-online", userId);
//     } else {
//       console.warn(
//         "[SocketService] Cannot set user online - socket not connected"
//       );
//     }
//   }

//   listenOnlineUsers(callback) {
//     console.log("[SocketService] Setting up online users listener");
//     if (this.socket) {
//       this.socket.on("online-users-update", (onlineUsers) => {
//         console.log("[Socket] Received online users update:", onlineUsers);
//         if (callback) {
//           callback(onlineUsers);
//         }
//       });
//     } else {
//       console.warn(
//         "[SocketService] Cannot listen for online users - socket not connected"
//       );
//     }
//   }

//   disconnect() {
//     console.log("[SocketService] Attempting to disconnect");
//     if (this.socket) {
//       this.socket.disconnect();
//       console.log("[Socket] Disconnected successfully");
//     } else {
//       console.warn("[SocketService] Cannot disconnect - socket not connected");
//     }
//   }
// }

// export default new SocketService();
// // import { io } from "socket.io-client";

// // class SocketService {
// //   constructor() {
// //     this.socket = null;
// //     this.token = null;
// //     this.apiUrl = process.env.API_URL || "http://localhost:4000";
// //     console.log("[SocketService] Initialized with API URL:", this.apiUrl);
// //   }

// //   connect(token) {
// //     console.log("[SocketService] Connecting with token:", token);
// //     this.token = token;

// //     try {
// //       this.socket = io(this.apiUrl, {
// //         auth: { token },
// //       });

// //       this.socket.on("connect", () => {
// //         console.log(
// //           "[Socket] Connected successfully. Socket ID:",
// //           this.socket.id
// //         );
// //       });

// //       this.socket.on("disconnect", () => {
// //         console.log("[Socket] Disconnected");
// //       });

// //       this.socket.on("connect_error", (error) => {
// //         console.error("[Socket] Connection error:", error.message);
// //       });

// //       return this.socket;
// //     } catch (error) {
// //       console.error("[SocketService] Connection failed:", error);
// //       return null;
// //     }
// //   }

// //   setUserOnline(userId) {
// //     console.log("[SocketService] Setting user online - User ID:", userId);
// //     if (this.socket) {
// //       console.log("[Socket] Emitting 'user-online' event");
// //       this.socket.emit("user-online", userId);
// //     } else {
// //       console.warn(
// //         "[SocketService] Cannot set user online - socket not connected"
// //       );
// //     }
// //   }

// //   listenOnlineUsers(callback) {
// //     console.log("[SocketService] Setting up online users listener");
// //     if (this.socket) {
// //       this.socket.on("online-users-update", (onlineUsers) => {
// //         console.log("[Socket] Received online users update:", onlineUsers);
// //         if (callback) {
// //           callback(onlineUsers);
// //         }
// //       });
// //     } else {
// //       console.warn(
// //         "[SocketService] Cannot listen for online users - socket not connected"
// //       );
// //     }
// //   }

// //   disconnect() {
// //     console.log("[SocketService] Attempting to disconnect");
// //     if (this.socket) {
// //       this.socket.disconnect();
// //       console.log("[Socket] Disconnected successfully");
// //     } else {
// //       console.warn("[SocketService] Cannot disconnect - socket not connected");
// //     }
// //   }
// // }

// // export default new SocketService();
