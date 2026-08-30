import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const resolveBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: resolveBaseUrl(),
  plugins: [jwtClient()],
});

export const { useSession, signIn, signOut, signUp } = authClient;
/** Gets a short-lived JWT signed by Better Auth for the separate Express API. */
export async function getBackendToken(): Promise<string> {
  const response = await fetch("/api/auth/token", { credentials: "include" });
  if (!response.ok) throw new Error("Your session has expired. Please sign in again.");
  const data = (await response.json()) as { token?: string };
  if (!data.token) throw new Error("Could not create an authentication token.");
  return data.token;
}
