"use client";
import { Inter } from "next/font/google";
import AuthWrapper from "./component/auth/AuthWrapper";
import { getConfig } from "./config";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
