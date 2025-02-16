// components/chat/MessageInput.js
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, Image, Smile } from "lucide-react";
import { sendMessage } from "@/redux/features/messages/messageSlice";
import { useSocket } from "@/context/SocketContext";

const MessageInput = ({ chatId }) => {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {
    sendMessage: socketSendMessage,
    startTyping,
    stopTyping,
  } = useSocket();
  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      startTyping(chatId, user._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(chatId, user._id);
    }, 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    try {
      // Stop typing indicator
      if (isTyping) {
        clearTimeout(typingTimeoutRef.current);
        setIsTyping(false);
        stopTyping(chatId, user._id);
      }

      // Dispatch the action to send message
      const resultAction = await dispatch(
        sendMessage({
          content: messageText,
          chatId,
        })
      );

      // If successful, notify via socket
      if (sendMessage.fulfilled.match(resultAction)) {
        socketSendMessage(resultAction.payload);
      }

      // Clear input
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className='p-4 border-t'>
      <div className='flex items-center gap-2'>
        <Button type='button' variant='ghost' size='icon'>
          <Paperclip className='h-5 w-5 text-gray-500' />
        </Button>

        <Input
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping();
          }}
          placeholder='Type a message...'
          className='flex-1'
        />

        <Button type='button' variant='ghost' size='icon'>
          <Image className='h-5 w-5 text-gray-500' alt='sdfas' />
        </Button>

        <Button type='button' variant='ghost' size='icon'>
          <Mic className='h-5 w-5 text-gray-500' />
        </Button>

        <Button type='button' variant='ghost' size='icon'>
          <Smile className='h-5 w-5 text-gray-500' />
        </Button>

        <Button
          type='submit'
          disabled={!messageText.trim()}
          className='bg-blue-500 hover:bg-blue-600'
        >
          <Send className='h-5 w-5' />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
