"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import socketService from "../services/socketService";

const SocketContext = createContext({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const apiUrl = process.env.API_URL || "http://localhost:4000";

  useEffect(() => {
    console.log("[SocketProvider] Starting useEffect");
    console.log("[SocketProvider] Current user:", user);
    console.log("[SocketProvider] Current token:", token);

    if (user && token) {
      console.log("[SocketProvider] Connecting socket...");
      const newSocket = socketService.connect(token);
      setSocket(newSocket);

      console.log("[SocketProvider] Setting user online...");
      socketService.setUserOnline(user._id);

      const fetchOnlineUsers = async () => {
        console.log("[SocketProvider] Fetching online users...");
        try {
          const response = await fetch(`${apiUrl}/api/v1/user/online-users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log("[SocketProvider] Fetched online users:", data);
          setOnlineUsers(data.data);
        } catch (error) {
          console.error("[SocketProvider] Error fetching online users:", error);
        }
      };

      socketService.listenOnlineUsers((users) => {
        console.log("[SocketProvider] Received online users update:", users);
        setOnlineUsers(users);
      });

      fetchOnlineUsers();

      return () => {
        console.log("[SocketProvider] Cleaning up socket connection");
        socketService.disconnect();
      };
    }
  }, [apiUrl, user, token]);

  console.log("[SocketProvider] Rendering with online users:", onlineUsers);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  console.log("[useSocket] Current context:", context);
  return context;
};
