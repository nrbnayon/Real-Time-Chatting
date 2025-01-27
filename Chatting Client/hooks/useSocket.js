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



// import { useEffect, useCallback } from "react";
// import { socket } from "@/utils/socket";

// export const useSocket = () => {
//   const sendMessage = useCallback((message: any) => {
//     socket.emit("message:send", message);
//   }, []);

//   const joinChat = useCallback((chatId: string) => {
//     socket.emit("chat:join", chatId);
//   }, []);

//   const leaveChat = useCallback((chatId: string) => {
//     socket.emit("chat:leave", chatId);
//   }, []);

//   useEffect(() => {
//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("message:received");
//     };
//   }, []);

//   return {
//     socket,
//     sendMessage,
//     joinChat,
//     leaveChat,
//   };
// };