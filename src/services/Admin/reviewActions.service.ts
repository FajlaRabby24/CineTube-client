"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  return { accessToken, sessionToken };
}

export async function approveReview(reviewId: string) {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch(
      `/reviews/${reviewId}/approve`,
      {},
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.success, message: res.message };
  } catch (error) {
    return { success: false, message: "Failed to approve review" };
  }
}

export async function rejectReview(reviewId: string, reason: string) {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch(
      `/reviews/${reviewId}/reject`,
      { reason },
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    return { success: res.success, message: res.message };
  } catch (error) {
    return { success: false, message: "Failed to reject review" };
  }
}

export async function deleteAdminReview(reviewId: string) {
  try {
    const { accessToken, sessionToken } = await getAuthHeaders();

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.delete(`/reviews/admin/${reviewId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return { success: res.success, message: res.message };
  } catch (error) {
    return { success: false, message: "Failed to delete review" };
  }
}
