"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface ITag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count: {
    mediaTags: number;
    reviewTags: number;
  };
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  return { accessToken, sessionToken };
}

export async function getAllTags(): Promise<ITag[] | null> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    const res = await httpClient.get<ITag[]>("/tags", {
      headers: accessToken
        ? {
            Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
          }
        : undefined,
    });

    return (res.data as ITag[]) ?? null;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return null;
  }
}

export async function createTag(payload: {
  name: string;
  slug: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) return { success: false, message: "Not authenticated" };

    const res = await httpClient.post("/tags", payload, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return { success: res.success, message: res.message };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { success: false, message: "Failed to create tag" };
  }
}

export async function updateTag(
  tagId: string,
  payload: { name?: string; slug?: string },
): Promise<{ success: boolean; message: string }> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) return { success: false, message: "Not authenticated" };

    const res = await httpClient.patch(`/tags/${tagId}`, payload, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return { success: res.success, message: res.message };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { success: false, message: "Failed to update tag" };
  }
}

export async function deleteTag(
  tagId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) return { success: false, message: "Not authenticated" };

    const res = await httpClient.delete(`/tags/${tagId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return { success: res.success, message: res.message };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, message: "Failed to delete tag" };
  }
}
