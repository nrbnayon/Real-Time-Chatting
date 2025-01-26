"use client";
import React from "react";
import Image from "next/image";
import { useSocket } from "@/context/SocketContext";

const OnlineUsers = () => {
  const { onlineUsers } = useSocket();
  // console.log("first online user", onlineUsers);

  return (
    <div className='online-users'>
      <h3>Online Users ({onlineUsers.length})</h3>
      {onlineUsers.map((user) => (
        <div key={user._id} className='online-user'>
          <Image
            src={user.profileImage}
            alt={user.name}
            width={40}
            height={40}
            className='user-avatar'
          />
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default OnlineUsers;
