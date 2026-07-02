// Bridges the Auth0 React hook (only usable inside components) with plain
// utility functions like `apiCallsNext.tsx` that need to attach an auth
// token to fetch calls but aren't React components themselves.

type IdTokenGetter = () => Promise<string | undefined>;

let idTokenGetter: IdTokenGetter | null = null;

export function registerIdTokenGetter(getter: IdTokenGetter) {
  idTokenGetter = getter;
}

export async function getIdToken(): Promise<string | undefined> {
  if (!idTokenGetter) return undefined;
  try {
    return await idTokenGetter();
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return undefined;
  }
}

export async function authHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
