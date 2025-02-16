// hooks/useChatMessages.js
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

export const useChatMessages = (chatId, initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const {
    socket,
    joinChat,
    leaveChat,
    sendMessage,
    markMessageRead,
    typingUsers,
  } = useSocket();

  // Join chat room when component mounts
  useEffect(() => {
    if (chatId && socket) {
      joinChat(chatId);

      // Listen for new messages
      const handleNewMessage = (message) => {
        if (message.chat.toString() === chatId.toString()) {
          setMessages((prev) => [...prev, message]);
        }
      };

      // Listen for message read updates
      const handleMessageRead = (data) => {
        if (data.chatId === chatId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === data.messageId
                ? { ...msg, readBy: [...(msg.readBy || []), data.userId] }
                : msg
            )
          );
        }
      };

      // Listen for reaction updates
      const handleReactionUpdate = (data) => {
        if (data.chatId === chatId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === data.messageId
                ? {
                    ...msg,
                    reactions: [
                      ...(msg.reactions || []),
                      {
                        userId: data.userId,
                        emoji: data.emoji,
                      },
                    ],
                  }
                : msg
            )
          );
        }
      };

      socket.on("message-received", handleNewMessage);
      socket.on("message-read-update", handleMessageRead);
      socket.on("reaction-update", handleReactionUpdate);

      // Clean up when component unmounts
      return () => {
        leaveChat(chatId);
        socket.off("message-received", handleNewMessage);
        socket.off("message-read-update", handleMessageRead);
        socket.off("reaction-update", handleReactionUpdate);
      };
    }
  }, [chatId, socket, joinChat, leaveChat]);

  // Get typing users for this chat
  const chatTypingUsers = [...typingUsers.keys()]
    .filter((key) => key.startsWith(`${chatId}-`))
    .map((key) => key.split("-")[1]);

  // Send a new message
  const sendNewMessage = useCallback(
    (messageData) => {
      sendMessage({
        ...messageData,
        chat: chatId,
      });

      // Optimistically add to local state
      const optimisticMessage = {
        ...messageData,
        chat: chatId,
        _id: Date.now().toString(), // temporary ID
        createdAt: new Date().toISOString(),
        readBy: [messageData.sender],
      };

      setMessages((prev) => [...prev, optimisticMessage]);
    },
    [chatId, sendMessage]
  );

  // Mark a message as read
  const markAsRead = useCallback(
    (messageId, userId) => {
      markMessageRead(messageId, chatId, userId);

      // Optimistically update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, readBy: [...new Set([...(msg.readBy || []), userId])] }
            : msg
        )
      );
    },
    [chatId, markMessageRead]
  );

  return {
    messages,
    sendNewMessage,
    markAsRead,
    chatTypingUsers,
  };
};
