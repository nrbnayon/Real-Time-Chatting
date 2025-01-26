// app\[user]\layout.js
"use client";
import ChatWindow from "@/components/ChatWindow/ChatWindow";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";

export default function Layout({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex h-screen overflow-hidden w-full'>
        <SidebarTrigger />

        {children}
      </main>
    </SidebarProvider>
  );
}
