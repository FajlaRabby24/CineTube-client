import { httpClient } from "@/lib/axios/httpClient";

export interface IDashboardStats {
  users: {
    total: number;
    active: number;
    banned: number;
  };
  media: {
    total: number;
    movies: number;
    series: number;
  };
  revenue: {
    total: number;
    monthly: number;
    yearly: number;
  };
  pending: {
    reviews: number;
    reports: number;
  };
}

export const getDashboardStats = async () => {
  try {
    const res = await httpClient.get<IDashboardStats>("/admin/stats");

    if (!res.success) {
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};
