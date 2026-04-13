"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export async function banUser(userId: string, reason?: string) {
  console.log(userId, reason, "user actions");
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch(
      `/admin/users/${userId}/ban`,
      { isBanned: true, bannedReason: reason },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.success, message: res.message };
  } catch (error) {
    console.error("Error banning user:", error);
    return { success: false, message: "Failed to ban user" };
  }
}

export async function unbanUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch(
      `/admin/users/${userId}/ban`,
      { isBanned: false },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.success, message: res.message };
  } catch (error) {
    console.error("Error unbanning user:", error);
    return { success: false, message: "Failed to unban user" };
  }
}
