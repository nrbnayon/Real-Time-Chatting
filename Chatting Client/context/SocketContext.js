// context/SocketContext.js
"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import socketServiceInstance from "../services/socketService";

const SocketContext = createContext({
  socket: null,
  onlineUsers: [],
  joinChat: () => {},
  leaveChat: () => {},
  sendMessage: () => {},
  startTyping: () => {},
  stopTyping: () => {},
  markMessageRead: () => {},
  initiateCall: () => {},
  acceptCall: () => {},
  rejectCall: () => {},
  sendCallSignal: () => {},
  endCall: () => {},
  sendReaction: () => {},
  typingUsers: new Map(),
  incomingCall: null,
  currentCall: null,
  isUserOnline: () => false,
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [incomingCall, setIncomingCall] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);

  const { user, token } = useSelector((state) => state.auth);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      const newSocket = socketServiceInstance.connect(token);
      setSocket(newSocket);
      socketServiceInstance.setUserOnline(user._id);

      // Fetch initial online users
      const fetchOnlineUsers = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/v1/user/online-users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setOnlineUsers(data.data);
          }
        } catch (error) {
          console.error("[SocketContext] Error fetching online users:", error);
        }
      };

      fetchOnlineUsers();

      return () => {
        socketServiceInstance.disconnect();
      };
    }
  }, [apiUrl, user, token]);

  // Set up event listeners
  useEffect(() => {
    if (!socket) return;

    // Online users update
    socket.on("online-users-update", (users) => {
      setOnlineUsers(users);
    });

    // Typing indicators
    socket.on("typing-update", ({ chatId, userId, isTyping }) => {
      setTypingUsers((prev) => {
        const newMap = new Map(prev);
        if (isTyping) {
          newMap.set(`${chatId}-${userId}`, true);
        } else {
          newMap.delete(`${chatId}-${userId}`);
        }
        return newMap;
      });
    });

    // Incoming call
    socket.on("call-incoming", (callSession) => {
      setIncomingCall(callSession);
    });

    // Call status updates
    socket.on("call-status-update", (updateData) => {
      if (updateData.status === "ongoing") {
        setCurrentCall((prev) => ({
          ...prev,
          status: "ongoing",
          acceptedBy: updateData.acceptedBy,
        }));
        setIncomingCall(null);
      }
    });

    // Call ended
    socket.on("call-ended", (endData) => {
      setCurrentCall((prev) => ({
        ...prev,
        status: endData.status,
        endedBy: endData.endedBy || endData.rejectedBy,
        endTime: new Date(),
      }));
      setTimeout(() => setCurrentCall(null), 3000);
    });

    // Call signal received
    socket.on("call-signal-received", (signalData) => {
      if (currentCall && currentCall._id === signalData.callId) {
        // Forward to call handler component
        window.dispatchEvent(
          new CustomEvent("webrtc-signal", {
            detail: signalData,
          })
        );
      }
    });

    return () => {
      socket.off("online-users-update");
      socket.off("typing-update");
      socket.off("call-incoming");
      socket.off("call-status-update");
      socket.off("call-ended");
      socket.off("call-signal-received");
    };
  }, [socket, currentCall]);

  // Socket action methods
  const joinChat = useCallback(
    (chatId) => {
      if (socket) socket.emit("join-chat", chatId);
    },
    [socket]
  );

  const leaveChat = useCallback(
    (chatId) => {
      if (socket) socket.emit("leave-chat", chatId);
    },
    [socket]
  );

  const sendMessage = useCallback(
    (message) => {
      if (socket) socket.emit("new-message", message);
    },
    [socket]
  );

  const startTyping = useCallback(
    (chatId, userId) => {
      if (socket) socket.emit("typing-start", { chatId, userId });
    },
    [socket]
  );

  const stopTyping = useCallback(
    (chatId, userId) => {
      if (socket) socket.emit("typing-stop", { chatId, userId });
    },
    [socket]
  );

  const markMessageRead = useCallback(
    (messageId, chatId, userId) => {
      if (socket) socket.emit("message-read", { messageId, chatId, userId });
    },
    [socket]
  );

  const initiateCall = useCallback(
    (chatId, callType, participants) => {
      if (socket) {
        socket.emit("call-initiate", { chatId, callType, participants });
        setCurrentCall({
          _id: chatId,
          chat: chatId,
          participants,
          callType,
          status: "initiating",
          initiator: user._id,
          startTime: new Date(),
        });
      }
    },
    [socket, user]
  );

  const acceptCall = useCallback(
    (callId) => {
      if (socket) {
        socket.emit("call-accept", callId);
        setCurrentCall(incomingCall);
        setIncomingCall(null);
      }
    },
    [socket, incomingCall]
  );

  const rejectCall = useCallback(
    (callId) => {
      if (socket) {
        socket.emit("call-reject", callId);
        setIncomingCall(null);
      }
    },
    [socket]
  );

  const sendCallSignal = useCallback(
    (callId, targetUserId, signal) => {
      if (socket) {
        socket.emit("call-signal", { callId, targetUserId, signal });
      }
    },
    [socket]
  );

  const endCall = useCallback(
    (callId) => {
      if (socket) {
        socket.emit("call-end", callId);
        setCurrentCall((prev) => ({
          ...prev,
          status: "ended",
          endTime: new Date(),
        }));
        setTimeout(() => setCurrentCall(null), 3000);
      }
    },
    [socket]
  );

  const sendReaction = useCallback(
    (messageId, chatId, emoji) => {
      if (socket) {
        socket.emit("message-reaction", { messageId, chatId, emoji });
      }
    },
    [socket]
  );

  const isUserOnline = useCallback(
    (userId) => {
      return onlineUsers.some((user) => user._id === userId);
    },
    [onlineUsers]
  );

  const contextValue = {
    socket,
    onlineUsers,
    joinChat,
    leaveChat,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageRead,
    initiateCall,
    acceptCall,
    rejectCall,
    sendCallSignal,
    endCall,
    sendReaction,
    typingUsers,
    incomingCall,
    currentCall,
    isUserOnline,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

// "use client";
// import { createContext, useState, useEffect, useContext } from "react";
// import { useSelector } from "react-redux";
// import socketService from "../services/socketService";

// const SocketContext = createContext({
//   socket: null,
//   onlineUsers: [],
// });

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const { user, token } = useSelector((state) => state.auth);
//   const apiUrl = process.env.API_URL || "http://localhost:4000";

//   useEffect(() => {
//     console.log("[SocketProvider] Starting useEffect");
//     console.log("[SocketProvider] Current user:", user);
//     console.log("[SocketProvider] Current token:", token);

//     if (user && token) {
//       console.log("[SocketProvider] Connecting socket...");
//       const newSocket = socketService.connect(token);
//       setSocket(newSocket);

//       console.log("[SocketProvider] Setting user online...");
//       socketService.setUserOnline(user._id);

//       const fetchOnlineUsers = async () => {
//         console.log("[SocketProvider] Fetching online users...");
//         try {
//           const response = await fetch(`${apiUrl}/api/v1/user/online-users`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           const data = await response.json();
//           console.log("[SocketProvider] Fetched online users:", data);
//           setOnlineUsers(data.data);
//         } catch (error) {
//           console.error("[SocketProvider] Error fetching online users:", error);
//         }
//       };

//       socketService.listenOnlineUsers((users) => {
//         console.log("[SocketProvider] Received online users update:", users);
//         setOnlineUsers(users);
//       });

//       fetchOnlineUsers();

//       return () => {
//         console.log("[SocketProvider] Cleaning up socket connection");
//         socketService.disconnect();
//       };
//     }
//   }, [apiUrl, user, token]);

//   console.log("[SocketProvider] Rendering with online users:", onlineUsers);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   console.log("[useSocket] Current context:", context);
//   return context;
// };
