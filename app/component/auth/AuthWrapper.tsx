'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { getConfig } from '../../config';

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [redirectUri, setRedirectUri] = useState<string | null>(null);
  const config = getConfig();

  useEffect(() => {
    setRedirectUri(window.location.origin);
  }, []);

  if (!redirectUri) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    ); // Show loading instead of null
  }

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

  return <Auth0Provider {...providerConfig}>{children}</Auth0Provider>;
}
