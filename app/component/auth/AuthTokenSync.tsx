'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { registerIdTokenGetter } from '../../utils/authToken';

// Registers a getter so that plain (non-hook) fetch helpers can attach the
// current user's Auth0 ID token to outgoing API requests.
export default function AuthTokenSync() {
  const { getIdTokenClaims, isAuthenticated } = useAuth0();

  useEffect(() => {
    registerIdTokenGetter(async () => {
      const claims = await getIdTokenClaims();
      return claims?.__raw;
    });
  }, [getIdTokenClaims, isAuthenticated]);

  return null;
}
