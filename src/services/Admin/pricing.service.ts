"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { SubscriptionPlan } from "@/lib/enum";
import { cookies } from "next/headers";

export interface IPricingPlan {
  id: string;
  name: string;
  plan: keyof typeof SubscriptionPlan;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  stripePriceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPricingCreatePayload {
  name: string;
  plan: keyof typeof SubscriptionPlan;
  price: number;
  currency?: string;
  features: string[];
  isActive?: boolean;
  isPopular?: boolean;
  stripePriceId?: string | null;
}

export interface IPricingUpdatePayload {
  name?: string;
  price?: number;
  features?: string[];
  isActive?: boolean;
  isPopular?: boolean;
  stripePriceId?: string | null;
}

export async function getAllPricingPlans() {
  try {
    const res = await httpClient.get<IPricingPlan[]>("/pricing");

    if (!res.success) {
      return { success: false, message: res.message };
    }

    return res?.data ?? null;
  } catch (error) {
    return null;
  }
}

export async function createPricingPlan(payload: IPricingCreatePayload) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.post<IPricingPlan>("/pricing", payload, {
      headers: {
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.success) {
      return { success: false, message: res.message };
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create pricing plan",
    };
  }
}

export async function updatePricingPlan(
  pricingId: string,
  payload: IPricingUpdatePayload,
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await httpClient.patch<IPricingPlan>(
      `/pricing/${pricingId}`,
      payload,
      {
        headers: {
          Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );

    if (!res.success) {
      return { success: false, message: res.message };
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update pricing plan",
    };
  }
}
