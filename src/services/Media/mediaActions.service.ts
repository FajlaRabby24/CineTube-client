"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export async function deleteMedia(mediaId: string) {
  try {
    const res = await httpClient.delete(`/media/${mediaId}`);

    return {
      success: true,
      message: res?.message || "Media deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete media",
    };
  }
}

export async function createMedia(data: any) {
  try {
    const res = await httpClient.post("/media", data);

    return {
      success: true,
      message: res?.message || "Media created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create media",
    };
  }
}

export async function updateMedia({ id, data }: { id: string; data: any }) {
  try {
    const res = await httpClient.patch(`/media/${id}`, data);

    return {
      success: true,
      message: res?.message || "Media updated successfully",
    };
  } catch (error: any) {
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
    return { success: false };
  }
}

export async function toggleLikeMedia(
  mediaId: string,
  type: "LIKE" | "DISLIKE",
) {
  try {
    const res = await httpClient.post(
      `/media/${mediaId}/like`,
      { type }
    );

    return {
      success: true,
      data: res?.data,
    };
  } catch (error: any) {
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
    const res = await httpClient.get(`/media/${mediaId}/vote-status`);

    const payload = res as any;
    const userVote = (payload?.data?.userVote as TVoteType) || null;

    return {
      success: true,
      data: { userVote },
    };
  } catch (error: any) {
    return { success: false, data: { userVote: null } };
  }
}
