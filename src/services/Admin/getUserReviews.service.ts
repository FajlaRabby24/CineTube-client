"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IReview {
  id: string;
  userId: string;
  mediaId: string;
  mediaTitle?: string;
  mediaPoster?: string;
  rating: number;
  title: string | null;
  content: string;
  hasSpoiler: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  publishedAt: string | null;
  rejectedReason: string | null;
  moderatedBy: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IGetUserReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: IReview[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export async function getUserReviews(userId: string, queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/admin/users/${userId}/reviews${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetUserReviewsResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    return res.data ?? null;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return null;
  }
}