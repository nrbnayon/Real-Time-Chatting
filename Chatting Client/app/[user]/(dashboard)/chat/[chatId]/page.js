// app/[user]/chat/[chatId]/page.js
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageArea from "@/components/chat/MessageArea";
import MessageInput from "@/components/chat/MessageInput";
import { accessChat, selectChat } from "@/redux/features/chat/chatSlice";
import { useSocket } from "@/context/SocketContext";
import { fetchMessages } from "@/redux/features/messages/messageSlice";

const ChatView = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { socket, joinChat, leaveChat } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const { chats, selectedChat } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.messages);

  // Get or initialize chat when the component mounts
  useEffect(() => {
    if (params.chatId) {
      // Find the chat in state if it exists
      const existingChat = chats.find((chat) => chat._id === params.chatId);

      console.log("first chat found", existingChat);

      if (existingChat) {
        dispatch(selectChat(existingChat));
      } else {
        dispatch(accessChat(params.chatId));
      }

      dispatch(fetchMessages(params.chatId));
    }
  }, [params.chatId, dispatch, chats]);

  // Join and leave chat room
  useEffect(() => {
    if (socket && params.chatId) {
      joinChat(params.chatId);

      return () => {
        leaveChat(params.chatId);
      };
    }
  }, [socket, params.chatId, joinChat, leaveChat]);

  if (!selectedChat) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-2'>Loading chat...</h2>
          <p className='text-gray-500'>
            Please wait while we load your conversation
          </p>
        </div>
      </div>
    );
  }

  const otherUser = selectedChat.users.find((u) => u._id !== user?._id);

  return (
    <div className='flex flex-col h-screen w-full'>
      <ChatHeader otherUser={otherUser} />
      <MessageArea messages={messages} currentUser={user} />
      <MessageInput chatId={params.chatId} />
    </div>
  );
};

export default ChatView;

// // app\[user]\(dashboard)\[chat]\page.js
// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "next/navigation";
// import { Avatar } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Send, Phone, Video, MoreVertical } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   fetchMessages,
//   sendMessage,
//   addMessage,
//   updateMessage,
//   deleteMessage,
// } from "@/redux/features/messages/messageSlice";
// import MessageList from "@/components/chat/MessageList";
// import { useSocket } from "@/context/SocketContext";

// const ChatView = () => {
//   const dispatch = useDispatch();
//   const params = useParams();
//   const { socket, isConnected } = useSocket();
//   const [messageInput, setMessageInput] = useState("");
//   const { user } = useSelector((state) => state.auth);
//   const { messages, loading } = useSelector((state) => state.messages);
//   const { selectedChat } = useSelector((state) => state.chat);

//   const setupSocketListeners = useCallback(() => {
//     if (!socket) return;

//     socket.on("message-received", (newMessage) => {
//       console.log("[Socket] New message received:", newMessage);
//       dispatch(addMessage(newMessage));
//     });

//     socket.on("message-updated", (updatedMessage) => {
//       console.log("[Socket] Message updated:", updatedMessage);
//       dispatch(updateMessage(updatedMessage));
//     });

//     socket.on("message-deleted", (messageId) => {
//       console.log("[Socket] Message deleted:", messageId);
//       dispatch(deleteMessage(messageId));
//     });

//     return () => {
//       socket.off("message-received");
//       socket.off("message-updated");
//       socket.off("message-deleted");
//     };
//   }, [socket, dispatch]);

//   useEffect(() => {
//     if (params.chatId) {
//       dispatch(fetchMessages(params.chatId));

//       if (socket && isConnected) {
//         console.log("[Socket] Joining chat:", params.chatId);
//         socket.emit("join-chat", params.chatId);
//       }
//     }

//     const cleanup = setupSocketListeners();

//     return () => {
//       if (socket && isConnected && params.chatId) {
//         console.log("[Socket] Leaving chat:", params.chatId);
//         socket.emit("leave-chat", params.chatId);
//       }
//       if (cleanup) cleanup();
//     };
//   }, [params.chatId, dispatch, socket, isConnected, setupSocketListeners]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!messageInput.trim() || !socket || !isConnected) return;

//     try {
//       const result = await dispatch(
//         sendMessage({
//           content: messageInput,
//           chatId: params.chatId,
//         })
//       ).unwrap();

//       console.log("[Socket] Emitting new message:", result);
//       socket.emit("new-message", result);
//       setMessageInput("");
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }
//   };

//   const otherUser = selectedChat?.users.find((u) => u._id !== user?._id);

//   return (
//     <div className='flex flex-col h-screen w-full'>
//       {/* Chat Header */}
//       <div className='flex items-center justify-between p-4 border-b'>
//         <div className='flex items-center gap-3'>
//           <Avatar
//             src={otherUser?.image}
//             alt={otherUser?.name}
//             className='h-10 w-10'
//           >
//             {otherUser?.name?.substring(0, 2)}
//           </Avatar>
//           <div>
//             <h2 className='font-semibold'>{otherUser?.name}</h2>
//             <p className='text-sm text-gray-500'>
//               {otherUser?.onlineStatus ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>
//         <div className='flex items-center gap-2'>
//           <Button variant='ghost' size='icon'>
//             <Phone className='h-5 w-5' />
//           </Button>
//           <Button variant='ghost' size='icon'>
//             <Video className='h-5 w-5' />
//           </Button>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='ghost' size='icon'>
//                 <MoreVertical className='h-5 w-5' />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align='end'>
//               <DropdownMenuItem>View Profile</DropdownMenuItem>
//               <DropdownMenuItem>Block User</DropdownMenuItem>
//               <DropdownMenuItem className='text-red-500'>
//                 Clear Chat
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <MessageList messages={messages} currentUser={user} />

//       {/* Message Input */}
//       <form onSubmit={handleSendMessage} className='p-4 border-t'>
//         <div className='flex items-center gap-2'>
//           <Input
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             placeholder='Type a message...'
//             className='flex-1'
//           />
//           <Button type='submit' disabled={!messageInput.trim() || !isConnected}>
//             <Send className='h-5 w-5' />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatView;
