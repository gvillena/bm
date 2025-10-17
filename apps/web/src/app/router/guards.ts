import { redirect } from "react-router-dom";
import { getAccessToken } from "@bm/sdk";

export async function requireAuthenticatedUser(request: Request) {
  const token = await getAccessToken();
  if (!token) {
    const url = new URL(request.url);
    throw redirect(`/?redirect=${encodeURIComponent(url.pathname)}`);
  }
}

export function ensureFeatureFlag(flag: string, flags: Record<string, boolean>) {
  if (!flags[flag]) {
    throw new Response("Feature disabled", { status: 403 });
  }
}
