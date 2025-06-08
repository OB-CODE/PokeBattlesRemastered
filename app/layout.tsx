"use client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./globals.css";
// import type { Metadata } from 'next'
import { Inter } from "next/font/google";

import { getConfig } from "./config";

const inter = Inter({ subsets: ["latin"] });

// can't use metadata on client side

// export const metadata: Metadata = {
//   title: 'Pokemon 2',
//   description: 'Next.JS application',
// }

// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Thanks a lot, In my case I was wrapping the body in the <Provider> of redux, by keeping <Provider> within body the issue has been resolved.
      https://stackoverflow.com/questions/72509865/error-there-was-an-error-while-hydrating-because-the-error-happened-outside-of
      */}
      <Auth0Provider {...providerConfig}>
        <body className={inter.className}>{children}</body>
      </Auth0Provider>
    </html>
  );
}
