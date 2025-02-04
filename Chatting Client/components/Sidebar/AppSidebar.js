"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Phone,
  Users,
  Bell,
  MoreVertical,
  Pin,
  Trash2,
  EyeOff,
  Edit,
  MessageCircle,
  Video,
  Star,
  Archive,
  Filter,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "../ui/sidebar";
import { useSocket } from "@/context/SocketContext";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  fetchChats,
  selectChat,
  updateChatPin,
  deleteChat,
  updateChatHidden,
} from "@/redux/features/chat/chatSlice";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip";

const AppSidebar = () => {
  const { onlineUsers } = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chats, selectedChat } = useSelector((state) => state.chat);
  const [filteredChats, setFilteredChats] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, unread, pinned, archived

  useEffect(() => {
    if (user) {
      dispatch(fetchChats());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!chats) return;

    let filtered = [...chats];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((chat) => {
        const otherUser = chat.users.find((u) => u._id !== user?._id);
        return (
          otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.latestMessage?.content
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply type filter
    switch (filterType) {
      case "unread":
        filtered = filtered.filter(
          (chat) => !chat.latestMessage?.readBy?.includes(user?._id)
        );
        break;
      case "pinned":
        filtered = filtered.filter((chat) => chat.isPinned);
        break;
      case "archived":
        filtered = filtered.filter((chat) => chat.isArchived);
        break;
    }

    // Sort chats
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (
        new Date(b.latestMessage?.createdAt || b.createdAt) -
        new Date(a.latestMessage?.createdAt || a.createdAt)
      );
    });

    setFilteredChats(filtered);
  }, [chats, searchQuery, filterType, user]);

  const tabs = [
    {
      id: "all",
      label: "All",
      icon: <MessageCircle className='h-5 w-5' />,
      count: chats?.length || 0,
    },
    {
      id: "unread",
      label: "Unread",
      icon: <Star className='h-5 w-5' />,
      count:
        chats?.filter(
          (chat) => !chat.latestMessage?.readBy?.includes(user?._id)
        )?.length || 0,
    },
    {
      id: "pinned",
      label: "Pinned",
      icon: <Pin className='h-5 w-5' />,
      count: chats?.filter((chat) => chat.isPinned)?.length || 0,
    },
    {
      id: "archived",
      label: "Archived",
      icon: <Archive className='h-5 w-5' />,
      count: chats?.filter((chat) => chat.isArchived)?.length || 0,
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFilterType(tabId);
  };

  const renderChatItem = (chat) => {
    const otherUser = chat.users.find((u) => u._id !== user?._id);
    const lastMessage = chat.latestMessage;
    const isOnline = otherUser?.onlineStatus;
    const unreadCount =
      lastMessage && !lastMessage.readBy?.includes(user?._id) ? 1 : 0;

    return (
      <div
        key={chat._id}
        className={`group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          selectedChat?._id === chat._id
            ? "bg-blue-50 hover:bg-blue-100"
            : "hover:bg-gray-50"
        }`}
      >
        <Link
          href={`/chat/${chat._id}`}
          className='flex-1 flex items-center gap-3'
        >
          <div className='relative'>
            <Avatar
              src={otherUser?.image}
              alt={otherUser?.name}
              className='h-12 w-12 border-2 border-gray-200'
            >
              {otherUser?.name?.substring(0, 2)}
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            {chat.isPinned && (
              <Pin className='absolute -top-1 -right-1 h-4 w-4 text-blue-500' />
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex justify-between items-center'>
              <h3 className='font-semibold text-gray-900 truncate'>
                {otherUser?.name}
              </h3>
              <span className='text-xs text-gray-500'>
                {lastMessage &&
                  formatDistanceToNow(new Date(lastMessage.createdAt), {
                    addSuffix: true,
                  })}
              </span>
            </div>
            <div className='flex items-center justify-between mt-1'>
              {lastMessage?.isDeleted ? (
                <span className='text-sm text-gray-400 italic'>
                  Message deleted
                </span>
              ) : (
                <p className='text-sm text-gray-600 truncate'>
                  {lastMessage?.content.substring(0, 20)}...
                </p>
              )}
              {unreadCount > 0 && (
                <Badge className='bg-blue-500 text-white'>{unreadCount}</Badge>
              )}
            </div>
          </div>
        </Link>

        <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='p-1 hover:bg-gray-200 rounded-full'>
                <MoreVertical className='h-4 w-4 text-gray-500' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem
                onClick={() => dispatch(updateChatPin({ chatId: chat._id }))}
                className='flex items-center gap-2'
              >
                <Pin className='h-4 w-4' />
                {chat.isPinned ? "Unpin chat" : "Pin chat"}
              </DropdownMenuItem>
              <DropdownMenuItem className='flex items-center gap-2'>
                <Video className='h-4 w-4' />
                Start video call
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => dispatch(updateChatHidden({ chatId: chat._id }))}
                className='flex items-center gap-2'
              >
                <EyeOff className='h-4 w-4' />
                Hide chat
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => dispatch(deleteChat(chat._id))}
                className='flex items-center gap-2 text-red-500'
              >
                <Trash2 className='h-4 w-4' />
                Delete chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <Sidebar className='w-80 flex flex-col bg-white border-r border-gray-200'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-xl font-bold text-gray-900'>Messages</h1>
          <div className='flex items-center gap-2'>
            <Tooltip content='New message'>
              <button className='p-2 text-gray-600 hover:bg-gray-100 rounded-full'>
                <Edit className='h-5 w-5' />
              </button>
            </Tooltip>
            <Tooltip content='Filter'>
              <button className='p-2 text-gray-600 hover:bg-gray-100 rounded-full'>
                <Filter className='h-5 w-5' />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            type='text'
            placeholder='Search messages...'
            className='w-full pl-10 bg-gray-50'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 p-2 overflow-x-auto border-b border-gray-200'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <Badge variant='secondary' className='bg-gray-200 text-gray-700'>
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto'>
        {filteredChats.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center p-4'>
            <MessageCircle className='h-12 w-12 text-gray-400 mb-2' />
            <h3 className='text-lg font-semibold text-gray-900'>No messages</h3>
            <p className='text-sm text-gray-500'>
              Start a conversation or search for messages
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {filteredChats.map(renderChatItem)}
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
