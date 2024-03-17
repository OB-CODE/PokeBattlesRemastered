"use client"
import './globals.css'
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { store } from './store'
import { Provider } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

// can't use metadata on client side

// export const metadata: Metadata = {
//   title: 'Pokemon 2',
//   description: 'Next.JS application',
// }

export default function RootLayout({
  
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Thanks a lot, In my case I was wrapping the body in the <Provider> of redux, by keeping <Provider> within body the issue has been resolved.
      https://stackoverflow.com/questions/72509865/error-there-was-an-error-while-hydrating-because-the-error-happened-outside-of
      */}
        <body className={inter.className}>{children}</body>
    </html>
  )
}
