"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export interface IUserDashboardStats {
  stats: {
    totalInteractions: number;
    reviewedTitles: number;
    watchlistCount: number;
    premiumDaysLeft: number;
    planName: string;
  };
  activityData: {
    day: string;
    count: number;
  }[];
  genreData: {
    genre: string;
    count: number;
  }[];
  recentActivity: {
    title: string;
    type: string;
    date: string;
    action: string;
  }[];
}

export const getUserDashboardStats = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await httpClient.get<IUserDashboardStats>(
      "/dashboard/user-stats",
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    if (!res.success) {
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching user dashboard stats:", error);
    return null;
  }
};
