"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IAdminReviewUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface IAdminReviewMedia {
  id: string;
  title: string;
  slug: string;
  posterUrl: string | null;
}

/**
 *  {
      id: "cmo63n9f40000okmdtkgsytw6",
      userId: "rMErvgk3LDmihRuAoABKBYOdIwoNiVzY",
      mediaId: "cmo2rd8t00003qcmd4c5g2pqn",
      rating: 5,
      title: null,
      content: "This is first review",
      hasSpoiler: false,
      status: "PENDING",
      publishedAt: null,
      rejectedReason: null,
      moderatedBy: null,
      likesCount: 0,
      commentsCount: 0,
      createdAt: "2026-04-19T18:28:27.374Z",
      updatedAt: "2026-04-19T18:28:27.374Z",
    }
 */

export interface IAdminReview {
  id: string;
  userId: string;
  mediaId: string;
  rating: number;
  title: string | null;
  content: string;
  hasSpoiler: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  publishedAt: string | null;
  rejectedReason: string | null;
  moderatedBy: string | null;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user: IAdminReviewUser;
  media: IAdminReviewMedia;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface IAdminReviewsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getAdminReviews(queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/reviews/admin${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IAdminReview[]>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    // console.log(res, "get admin reviews service");

    return res ?? null;
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return null;
  }
}
