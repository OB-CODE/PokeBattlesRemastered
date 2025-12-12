'use client';
import { Inter } from 'next/font/google';
import AuthWrapper from './component/auth/AuthWrapper';
import { getConfig } from './config';
import './globals.css';

// Critical images to preload via link tags for fastest loading
const CRITICAL_PRELOAD_IMAGES = [
  '/ball.png',
  '/GoldBall.png',
  '/potionSmall.svg',
  '/potionLarge.svg',
  '/candycane.png',
  '/glove.png',
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical shop images for faster loading */}
        {CRITICAL_PRELOAD_IMAGES.map((src) => (
          <link
            key={src}
            rel="preload"
            href={src}
            as="image"
          />
        ))}
      </head>
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
