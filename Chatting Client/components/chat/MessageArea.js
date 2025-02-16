// components/chat/MessageArea.js
import React, { useRef, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { useSocket } from "@/context/SocketContext";

const MessageArea = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);
  const { markMessageRead } = useSocket();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark unread messages as read
  useEffect(() => {
    if (messages.length > 0 && currentUser) {
      messages.forEach((msg) => {
        if (
          msg.sender._id !== currentUser._id &&
          !msg.readBy?.includes(currentUser._id)
        ) {
          markMessageRead(msg._id, msg.chat, currentUser._id);
        }
      });
    }
  }, [messages, currentUser, markMessageRead]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
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
            const isOwnMessage = message.sender._id === currentUser?._id;

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
                    >
                      {message.sender.name?.substring(0, 2)}
                    </Avatar>
                  )}

                  <div>
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
                        <p>{message.content}</p>
                      )}
                    </div>

                    <div
                      className={`text-xs mt-1 ${
                        isOwnMessage ? "text-right" : ""
                      } text-gray-500`}
                    >
                      {format(new Date(message.createdAt), "h:mm a")}
                      {isOwnMessage && message.readBy?.length > 1 && (
                        <span className='ml-1'>✓✓</span>
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
