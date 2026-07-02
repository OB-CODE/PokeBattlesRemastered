import { NextRequest, NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const domain = process.env.AUTH0_DOMAIN || process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const clientId =
  process.env.AUTH0_CLIENT_ID || process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!domain) {
    throw new Error('Missing AUTH0_DOMAIN environment variable');
  }
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`https://${domain}/.well-known/jwks.json`)
    );
  }
  return jwks;
}

/**
 * Verifies the Auth0 ID token sent as a Bearer token and returns the
 * authenticated user's `sub`. Returns null if the token is missing or
 * fails verification (bad signature, wrong issuer/audience, expired, etc).
 */
export async function getVerifiedUserId(
  req: NextRequest
): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token || !domain || !clientId) return null;

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: `https://${domain}/`,
      audience: clientId,
    });
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return null;
  }
}

/**
 * Verifies the request's Bearer token and ensures it belongs to
 * `expectedUserId`. Returns a 401/403 NextResponse to short-circuit the
 * handler on failure, or null when the request is authorized.
 */
export async function requireMatchingUser(
  req: NextRequest,
  expectedUserId: string
): Promise<NextResponse | null> {
  const verifiedUserId = await getVerifiedUserId(req);

  if (!verifiedUserId) {
    return NextResponse.json(
      { error: 'Missing or invalid authentication token' },
      { status: 401 }
    );
  }

  if (verifiedUserId !== expectedUserId) {
    return NextResponse.json(
      { error: 'You are not authorized to access this resource' },
      { status: 403 }
    );
  }

  return null;
}
