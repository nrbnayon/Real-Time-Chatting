import React, { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import socketService from "../services/socketService";

const SocketContext = createContext({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, id:_id } = useSelector((state) => state.auth);
  const apiUrl = process.env.API_URL || "http://localhost:4000";

  useEffect(() => {
    console.log("user", user, "token", token);
    if (user && id) {
      // Connect socket
      const newSocket = socketService.connect(id);
      setSocket(newSocket);

      // Set user online
      socketService.setUserOnline(user.id);

      // Listen for online users updates
      const fetchOnlineUsers = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/users/online-users`, {
            headers: {
              Authorization: `Bearer ${id}`,
            },
          });
          const data = await response.json();
          setOnlineUsers(data.data);
        } catch (error) {
          console.error("Error fetching online users:", error);
        }
      };

      socketService.listenOnlineUsers(fetchOnlineUsers);

      return () => {
        socketService.disconnect();
      };
    }
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
