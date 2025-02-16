// components/chat/MessageArea.js
import React, { useRef, useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { useSocket } from "@/context/SocketContext";
// import { Spinner } from "@/components/ui/spinner";

const MessageArea = ({ messages = [], currentUser, chatId }) => {
  const messagesEndRef = useRef(null);
  const { socket, markMessageRead } = useSocket();
  const [loading, setLoading] = useState(true);

  console.log("Get message:", messagesEndRef, socket, markMessageRead);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (messages.length > 0) {
      scrollToBottom();
      setLoading(false);
    }
  }, [messages]);

  // Mark unread messages as read
  useEffect(() => {
    if (messages.length > 0 && currentUser?._id && chatId) {
      const unreadMessages = messages.filter(
        (msg) =>
          msg.sender._id !== currentUser._id &&
          !msg.readBy?.includes(currentUser._id)
      );

      unreadMessages.forEach((msg) => {
        markMessageRead(msg._id, chatId, currentUser._id);

        // Emit socket event for real-time read status
        socket?.emit("message-read", {
          messageId: msg._id,
          chatId: chatId,
          userId: currentUser._id,
        });
      });
    }
  }, [messages, currentUser, chatId, markMessageRead, socket]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    if (!message?.createdAt) return groups;

    const date = new Date(message.createdAt);
    let dateStr;

    if (isToday(date)) {
      dateStr = "Today";
    } else if (isYesterday(date)) {
      dateStr = "Yesterday";
    } else {
      dateStr = format(date, "MMMM d, yyyy");
    }

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }

    groups[dateStr].push(message);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        {/* <Spinner size='lg' /> */}
        Loading ...
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className='flex-1 flex items-center justify-center text-gray-500'>
        No messages yet. Start a conversation!
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-6'>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className='space-y-4'>
          <div className='flex justify-center'>
            <span className='text-xs bg-gray-100 rounded-full px-3 py-1 text-gray-500'>
              {date}
            </span>
          </div>

          {dateMessages.map((message) => {
            if (!message?.sender || !currentUser) return null;

            const isOwnMessage = message.sender._id === currentUser._id;
            const messageTime = message.createdAt
              ? format(new Date(message.createdAt), "h:mm a")
              : "";

            return (
              <div
                key={message._id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div className='flex max-w-[70%]'>
                  {!isOwnMessage && (
                    <Avatar
                      src={message.sender.image}
                      className='h-8 w-8 mr-2 mt-1'
                      alt={message.sender.name}
                    >
                      {message.sender.name?.substring(0, 2).toUpperCase()}
                    </Avatar>
                  )}

                  <div>
                    {!isOwnMessage && (
                      <div className='text-xs text-gray-500 mb-1'>
                        {message.sender.name}
                      </div>
                    )}

                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.isDeleted ? (
                        <span className='italic text-gray-400'>
                          This message was deleted
                        </span>
                      ) : (
                        <>
                          <p>{message.content}</p>
                          {message.isEdited && (
                            <span className='text-xs ml-1 opacity-70'>
                              (edited)
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div
                      className={`text-xs mt-1 ${
                        isOwnMessage ? "text-right" : ""
                      } text-gray-500`}
                    >
                      {messageTime}
                      {isOwnMessage && (
                        <span className='ml-1'>
                          {message.readBy?.length > 1 ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;
