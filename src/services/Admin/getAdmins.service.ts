"use server";

import { envVars } from "@/config/env";
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  bio: string | null;
  isActive: boolean;
  isBanned: boolean;
  bannedReason: string | null;
  phoneNumber: string | null;
  bannedAt: string | null;
  needPasswordChange: boolean;
  subscription: unknown | null;
}

export interface IGetAdminsApiResponse {
  success: boolean;
  message: string;
  data: {
    data: IAdmin[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IGetAdminByIdResponse {
  success: boolean;
  message: string;
  data: IAdmin;
}

export async function getAllAdmins(queryString: string = "") {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/admin/admins${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IGetAdminsApiResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    return res.data ?? null;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return null;
  }
}

export async function getAdminById(adminId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const url = `/admin/admins/${adminId}`;
    const res = await httpClient.get<IGetAdminByIdResponse>(url, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    return res.data ?? null;
  } catch (error) {
    console.error("Error fetching admin:", error);
    return null;
  }
}