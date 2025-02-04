// components\Sidebar\AppSidebar.js
"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import LoginUser from "@/assets/icons/user-one.png";
import UserMenu from "../Auth/UserMenu";
import { Sidebar } from "../ui/sidebar";
import { useSocket } from "@/context/SocketContext";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useDynamicTypesQuery } from "@/redux/features/dynamicType/dynamicTypeApiSlice";

const AppSidebar = () => {
  const { onlineUsers } = useSocket();
  const { user } = useSelector((state) => state.auth || {});
  console.log("Get Login user in AppSidebar", user);

    const {
      data: userData,
      isLoading,
      isFetching,
      error,
    } = useDynamicTypesQuery({
      dynamicApi: "search-user",
      searchParams: { searchTerm, page, limit },
    });

  const initialChats = [
    {
      id: 1,
      name: "Copilot",
      message: "Hey, this is Copilot!",
      time: "12/5/2024",
      avatar: "/lovable-uploads/c6d2b5b1-1f26-4323-afb5-e9353e5e383c.png",
      status: "online",
      pinned: false,
    },
    {
      id: 2,
      name: "IT Support || STA",
      message: "Alif Shariyar joined this...",
      time: "11:12 AM",
      avatar: "/placeholder.svg",
      unread: 34,
      pinned: false,
    },
    {
      id: 3,
      name: "Alpha Bytes (Internal)",
      message: "Call ended | 17m 19s",
      time: "9:41 AM",
      avatar: "/placeholder.svg",
      pinned: false,
    },
    {
      id: 4,
      name: "Official Announcement - 2",
      message: "Shammi added...",
      time: "Sat",
      avatar: "/placeholder.svg",
      pinned: false,
    },
    {
      id: 5,
      name: "Limon Islam 🏠",
      message: "Vaiya HR dekha korte bolce",
      time: "Sat",
      avatar: "/placeholder.svg",
      status: "away",
      pinned: false,
    },
  ];

  const [chats, setChats] = useState(initialChats);
  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");

  const togglePin = (chatId) => {
    const pinnedChats = chats.filter((chat) => chat.pinned);
    const chatToToggle = chats.find((chat) => chat.id === chatId);

    if (pinnedChats.length < 4) {
      const updatedChats = chats.map((chat) =>
        chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      );

      // Sort so pinned chats come first
      const sortedChats = updatedChats.sort(
        (a, b) =>
          b.pinned - a.pinned ||
          updatedChats.indexOf(a) - updatedChats.indexOf(b)
      );

      setChats(sortedChats);
    } else if (chatToToggle.pinned) {
      // Allow unpinning if already pinned
      const updatedChats = chats.map((chat) =>
        chat.id === chatId ? { ...chat, pinned: false } : chat
      );
      setChats(updatedChats);
    }
  };

  const deleteChat = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
  };

  const hideChat = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
  };

  const tabs = [
    {
      id: "chats",
      label: "Chats",
      icon: <div className='text-lg'>💬</div>,
      badge: 1,
    },
    {
      id: "calls",
      label: "Calls",
      icon: <Phone className='h-5 w-5' />,
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: <Users className='h-5 w-5' />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className='h-5 w-5' />,
      badge: 7,
    },
  ];

  return (
    <Sidebar className={cn("min-w-80 overflow-hidden")}>
      <div className='w-80 h-screen flex flex-col border-r border-gray-200 bg-white'>
        {/* User Profile Header */}
        <div className='p-3 flex items-center justify-between border-b border-gray-200'>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <Avatar className='h-10 w-10 border border-gray-300 p-1'>
                <Image
                  src={user?.profileImage || user?.image || LoginUser}
                  alt='User'
                  width={100}
                  height={100}
                  priority
                  className='rounded-full'
                />
              </Avatar>
              <div className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white'></div>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>
                {user?.name || user?.email || "User"}
              </span>
              <span className='text-xs text-gray-500'>Be right back</span>
            </div>
          </div>
          <button className='p-1 hover:bg-gray-100 rounded'>
            {/* <MoreVertical className='h-5 w-5 text-gray-500' /> */}
            <UserMenu />
          </button>
        </div>
        {/* Search Bar */}
        <div className='p-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              type='text'
              placeholder='People, groups, messages'
              className='w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className='flex justify-between px-3 py-2 border-b border-gray-200'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-md relative ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              <span className='text-xs mt-1'>{tab.label}</span>
              {tab.badge && (
                <Badge className='absolute -top-1 -right-1 h-4 min-w-4 flex text-white items-center justify-center bg-red-500 text-[10px]'>
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className='flex-1 overflow-y-auto'>
          <div className='p-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-sm font-semibold text-gray-500 mb-2'>
                Online ({onlineUsers.length})
              </h2>
              <button className='p-2 bg-blue-500 rounded-full '>
                <Edit className='h-4 w-4 text-white' />
              </button>
            </div>
            <div className='space-y-1 mt-2'>
              {/* {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors",
                    chat.pinned && "bg-blue-50"
                  )}
                > */}
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors",
                    chat.pinned && "bg-blue-50"
                  )}
                  onClick={() => handleChatClick(chat.id)}
                >
                  <Link href={`/welcome-nayon/chat/${chat.id}`}>
                    <div className='relative flex-shrink-0'>
                      <Avatar className='h-10 w-10 border border-gray-300'>
                        <AvatarImage src={chat.avatar} alt={chat.name} />
                        <AvatarFallback>
                          {chat.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      {chat.status && (
                        <div
                          className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                            chat.status === "online"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          )}
                        ></div>
                      )}
                      {chat.pinned && (
                        <Pin
                          className='absolute top-0 right-0 h-3 w-3 text-blue-500'
                          fill='currentColor'
                        />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between items-start'>
                        <span className='text-sm font-semibold truncate'>
                          {chat.name}
                        </span>
                        <span className='text-xs text-gray-500 flex-shrink-0'>
                          {chat.time}
                        </span>
                      </div>
                      <p className='text-sm text-gray-500 truncate'>
                        {chat.message}
                      </p>
                    </div>
                    {chat.unread && (
                      <Badge className='h-5 min-w-5 flex items-center text-white justify-center bg-blue-500'>
                        {chat.unread}
                      </Badge>
                    )}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className='h-4 w-4 text-gray-500' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={cn("bg-white z-10")}>
                      <DropdownMenuItem
                        onSelect={() => togglePin(chat.id)}
                        className='flex items-center gap-2'
                      >
                        <Pin className='h-4 w-4' />
                        {chat.pinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => deleteChat(chat.id)}
                        className='flex items-center gap-2 text-red-500'
                      >
                        <Trash2 className='h-4 w-4' />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => hideChat(chat.id)}
                        className='flex items-center gap-2'
                      >
                        <EyeOff className='h-4 w-4' />
                        Hide
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
