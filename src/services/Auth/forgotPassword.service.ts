"use server";

import { httpClient } from "@/lib/axios/httpClient";

export async function forgotPasswordAction(email: string) {
  try {
    const res = await httpClient.post("/auth/forget-password", { email });

    if (!res.success) {
      return {
        success: false,
        message: res.message || "Failed to send reset link",
      };
    }

    return {
      success: true,
      message: res.message || "Reset link sent to your email",
      route: `/reset-password?email=${email}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
}
