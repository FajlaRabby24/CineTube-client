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

export async function createMedia(data: any) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken)
      return { success: false, message: "Unauthorized" };

    const res = await httpClient.post("/media", data, {
      headers: {
        Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
      },
    });

    return {
      success: true,
      message: res?.message || "Media created successfully",
    };
  } catch (error: any) {
    console.error("Error creating media:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create media",
    };
  }
}

export async function updateMedia({ id, data }: { id: string; data: any }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken)
      return { success: false, message: "Unauthorized" };

    const res = await httpClient.patch(`/media/${id}`, data, {
      headers: {
        Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
      },
    });

    return {
      success: true,
      message: res?.message || "Media updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating media:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update media",
    };
  }
}

export async function addViews(mediaId: string) {
  try {
    const res = await httpClient.post(`/media/${mediaId}/add-views`, {});
    return {
      success: true,
      data: res?.data,
    };
  } catch (error: any) {
    console.error("Error adding view:", error);
    return { success: false };
  }
}

export async function toggleLikeMedia(
  mediaId: string,
  type: "LIKE" | "DISLIKE",
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken)
      return { success: false, message: "Unauthorized" };

    const res = await httpClient.post(
      `/media/${mediaId}/like`,
      { type },
      {
        headers: {
          Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
        },
      },
    );

    return {
      success: true,
      data: res?.data,
    };
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to vote",
    };
  }
}

type TVoteType = "LIKE" | "DISLIKE" | null;

export async function getUserVoteStatus(
  mediaId: string,
): Promise<{ success: boolean; data: { userVote: TVoteType } }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken && !sessionToken)
      return { success: false, data: { userVote: null } };

    const res = await httpClient.get(`/media/${mediaId}/vote-status`, {
      headers: {
        Cookie: `accessToken=${accessToken || ""}; better-auth.session_token=${sessionToken || ""}`,
      },
    });

    const responseBody = res?.data as any;
    const userVote = (responseBody?.data?.userVote as TVoteType) || null;

    return {
      success: true,
      data: { userVote },
    };
  } catch (error: any) {
    console.error("Error fetching vote status:", error);
    return { success: false, data: { userVote: null } };
  }
}
