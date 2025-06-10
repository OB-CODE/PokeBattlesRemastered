"use client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getConfig } from "./config";

const inter = Inter({ subsets: ["latin"] });

const config = getConfig();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [redirectUri, setRedirectUri] = useState<string | null>(null);

  useEffect(() => {
    setRedirectUri(window.location.origin);
  }, []);

  if (!redirectUri) return null; // or a loading spinner

  const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: redirectUri,
      ...(config.authorizationParams?.audience
        ? { audience: config.authorizationParams.audience }
        : null),
    },
  };

  return (
    <html lang="en">
      <Auth0Provider {...providerConfig}>
        <body className={inter.className}>{children}</body>
      </Auth0Provider>
    </html>
  );
}
