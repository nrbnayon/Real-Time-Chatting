// // app/[user]/chat/[chatId]/page.js

"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageArea from "@/components/chat/MessageArea";
import MessageInput from "@/components/chat/MessageInput";
import { accessChat, selectChat } from "@/redux/features/chat/chatSlice";
import { useSocket } from "@/context/SocketContext";
import {
  fetchMessages,
  selectMessagesByChatId,
  selectMessagesLoading,
} from "@/redux/features/messages/messageSlice";

const ChatView = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { socket, joinChat, leaveChat } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const { chats, selectedChat } = useSelector((state) => state.chat);

  const messages = useSelector((state) =>
    selectMessagesByChatId(state, params.chatId)
  );
  const loading = useSelector(selectMessagesLoading);

  // Debug logs
  console.log("[ChatView] Current params:", params);
  console.log("[ChatView] Selected chat:", selectedChat);
  console.log("[ChatView] Messages:", messages);
  console.log("[ChatView] Loading state:", loading);

  // Get or initialize chat when the component mounts
  useEffect(() => {
    if (params.chatId) {
      console.log("[ChatView] Initializing chat for ID:", params.chatId);

      // Find the chat in state if it exists
      const existingChat = chats.find((chat) => chat._id === params.chatId);

      if (existingChat) {
        console.log("[ChatView] Found existing chat:", existingChat);
        dispatch(selectChat(existingChat));
      } else {
        console.log("[ChatView] Fetching new chat");
        dispatch(accessChat(params.chatId));
      }

      // Fetch messages for this chat
      console.log("[ChatView] Fetching messages");
      dispatch(fetchMessages(params.chatId));
    }
  }, [params.chatId, dispatch, chats]);

  // Join and leave chat room
  useEffect(() => {
    if (socket && params.chatId) {
      console.log("[ChatView] Joining chat room:", params.chatId);
      joinChat(params.chatId);

      return () => {
        console.log("[ChatView] Leaving chat room:", params.chatId);
        leaveChat(params.chatId);
      };
    }
  }, [socket, params.chatId, joinChat, leaveChat]);

  if (!selectedChat) {
    console.log("[ChatView] No selected chat, showing loading state");
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
  console.log("[ChatView] Other user in chat:", otherUser);

  return (
    <div className='flex flex-col h-screen w-full'>
      <ChatHeader otherUser={otherUser} />
      <MessageArea
        messages={messages}
        currentUser={user}
        chatId={params.chatId}
      />
      <MessageInput chatId={params.chatId} />
    </div>
  );
};

export default ChatView;
// "use client";

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "next/navigation";
// import ChatHeader from "@/components/chat/ChatHeader";
// import MessageArea from "@/components/chat/MessageArea";
// import MessageInput from "@/components/chat/MessageInput";
// import { accessChat, selectChat } from "@/redux/features/chat/chatSlice";
// import { useSocket } from "@/context/SocketContext";
// import { fetchMessages } from "@/redux/features/messages/messageSlice";

// const ChatView = () => {
//   const dispatch = useDispatch();
//   const params = useParams();
//   const { socket, joinChat, leaveChat } = useSocket();
//   const { user } = useSelector((state) => state.auth);
//   const { chats, selectedChat } = useSelector((state) => state.chat);
//   // const { messages } = useSelector((state) => state.messages);

//   const messages = useSelector((state) =>
//     selectMessagesByChatId(state, chatId)
//   );
//   const loading = useSelector(selectMessagesLoading);

//   // Get or initialize chat when the component mounts
//   useEffect(() => {
//     if (params.chatId) {
//       // Find the chat in state if it exists
//       const existingChat = chats.find((chat) => chat._id === params.chatId);

//       if (existingChat) {
//         dispatch(selectChat(existingChat)); // Set selectedChat for existingChat
//       } else {
//         // Fetch the chat if it doesn't exist in state
//         dispatch(accessChat(params.chatId)); // accessChat will set selectedChat in extraReducers
//       }

//       // Fetch messages for this chat
//       dispatch(fetchMessages(params.chatId));
//     }
//   }, [params.chatId, dispatch, chats]);

//   // Join and leave chat room
//   useEffect(() => {
//     if (socket && params.chatId) {
//       joinChat(params.chatId);

//       return () => {
//         leaveChat(params.chatId);
//       };
//     }
//   }, [socket, params.chatId, joinChat, leaveChat]);

//   if (!selectedChat) {
//     return (
//       <div className='flex items-center justify-center h-screen w-full'>
//         <div className='text-center'>
//           <h2 className='text-xl font-semibold mb-2'>Loading chat...</h2>
//           <p className='text-gray-500'>
//             Please wait while we load your conversation
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const otherUser = selectedChat.users.find((u) => u._id !== user?._id);

//   return (
//     <div className='flex flex-col h-screen w-full'>
//       <ChatHeader otherUser={otherUser} />
//       <MessageArea
//         // messages={messages}
//         // currentUser={user}
//         messages={messages}
//         currentUser={user}
//         chatId={params?.chatId || chatId}
//       />
//       <MessageInput chatId={params.chatId} />
//     </div>
//   );
// };

// export default ChatView;
