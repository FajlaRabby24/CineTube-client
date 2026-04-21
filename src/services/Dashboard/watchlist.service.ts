"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IWatchlistMedia {
  id: string;
  title: string;
  slug: string;
  youtubeStreamUrl: string | null;
  type: "MOVIE" | "SHOW";
  releaseYear: number;
}

export interface IWatchlistItem {
  id: string;
  userId: string;
  mediaId: string;
  createdAt: string;
  media: IWatchlistMedia;
}

export async function getUserWatchlist(queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/watchlist${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IWatchlistItem[]>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    console.log(res, "watch list service");
    return res ?? null;
  } catch (error) {
    console.error("Error fetching user watchlist:", error);
    return null;
  }
}

export async function removeFromWatchlist(mediaId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Unauthorized" };
    }

    const res = await httpClient.delete(`/watchlist/${mediaId}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    return { success: true, message: "Removed from watchlist successfully" };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to remove from watchlist",
    };
  }
}
