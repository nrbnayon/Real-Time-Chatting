import { useEffect } from "react";
import { useSelector } from "react-redux";
import { initializeSocket } from "@/lib/socket";

export const useSocket = () => {
  // Retrieve userId from state.auth
  const { _id: userId } = useSelector((state) => state.auth);

  console.log("User ID:", userId);

  useEffect(() => {
    if (userId) {
      const socket = initializeSocket(userId);

      // Cleanup function to disconnect the socket
      return () => {
        socket.disconnect();
      };
    }
  }, [userId]);
};
