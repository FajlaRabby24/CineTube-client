"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export async function deleteMedia(mediaId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) return { success: false, message: "Unauthorized" };

    const res = await httpClient.delete(`/media/${mediaId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return {
      success: true,
      message: res?.message || "Media deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting media:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete media",
    };
  }
}
