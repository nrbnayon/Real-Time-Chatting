// "use client";
// import React from "react";
// import { useParams } from "next/navigation";
// import { Avatar } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Send, Phone, Video, MoreVertical } from "lucide-react";
// const ChatPage = () => {
//   const params = useParams();
//   const chatId = params.chatId;
//   return (
//     <div className='flex flex-col h-screen w-full'>
//       {/* Chat Header */}
//       <div className='flex items-center justify-between p-4 border-b'>
//         <div className='flex items-center gap-3'>
//           <Avatar className='h-10 w-10'>Hello</Avatar>
//           <div>
//             <h2 className='font-semibold'>Chat {chatId}</h2>
//             <span className='text-sm text-gray-500'>Online</span>
//           </div>
//         </div>
//         <div className='flex items-center gap-4'>
//           <button className='p-2 hover:bg-gray-100 rounded-full'>
//             <Phone className='h-5 w-5 text-gray-600' />
//           </button>
//           <button className='p-2 hover:bg-gray-100 rounded-full'>
//             <Video className='h-5 w-5 text-gray-600' />
//           </button>
//           <button className='p-2 hover:bg-gray-100 rounded-full'>
//             <MoreVertical className='h-5 w-5 text-gray-600' />
//           </button>
//         </div>
//       </div>
//       {/* Chat Messages */}
//       <div className='flex-1 overflow-y-auto p-4 space-y-4'>
//         {/* Messages will be rendered here */}
//       </div>
//       {/* Chat Input */}
//       <div className='p-4 border-t'>
//         <div className='flex items-center gap-2'>
//           <Input placeholder='Type a message' className='flex-1' />
//           <button className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600'>
//             <Send className='h-5 w-5' />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ChatPage;
"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";

const ChatView = () => {
  const params = useParams();
  const chatId = params.chatId;
  const messages = [
    {
      id: 1,
      content: "Hey, how are you?",
      sender: "user",
      timestamp: "11:12 AM",
    },
    {
      id: 2,
      content: "I'm good, thanks! How about you?",
      sender: "other",
      timestamp: "11:13 AM",
    },
    {
      id: 3,
      content: "Just working on some new features.",
      sender: "user",
      timestamp: "11:14 AM",
    },
  ];

  return (
    <div className='flex flex-col h-screen w-full'>
      {/* Chat Header */}
      <div className='flex items-center justify-between p-4 border-b'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src='/placeholder.svg' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className='font-semibold'>Chat with {chatId}</h2>
            <p className='text-sm text-gray-500'>Online</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon'>
            <Phone className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon'>
            <Video className='h-5 w-5' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreVertical className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Block User</DropdownMenuItem>
              <DropdownMenuItem className='text-red-500'>
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.content}</p>
              <span className='text-xs opacity-70 mt-1 block'>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className='p-4 border-t'>
        <div className='flex items-center gap-2'>
          <Input placeholder='Type a message...' className='flex-1' />
          <Button>
            <Send className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
