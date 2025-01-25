"use client";

import React from "react";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} fallback-font antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <DndProvider backend={HTML5Backend}>
              <Header />
              {children}
            </DndProvider>
          </AuthProvider>
        </ReduxProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
