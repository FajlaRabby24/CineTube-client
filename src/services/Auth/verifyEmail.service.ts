"use server";

import { IVerifyEmailOtpResponse } from "@/types/auth.types";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtilts";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { httpClient } from "../../lib/axios/httpClient";
import { verifyEmailSchema } from "../../zod/auth.validation";

export const verifyEmailAction = async (
  email: string,
  otp: string,
  redirectPath: string | undefined,
) => {
  console.log(email, otp);
  const parsedPayload = verifyEmailSchema.safeParse({ email, otp });
  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IVerifyEmailOtpResponse>(
      "/auth/verify-email-otp",
      {
        email,
        otp,
      },
    );

    const {
      accessToken,
      refreshToken,
      token,
      user: { role },
    } = response.data;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      token,
      60 * 60 * 24 * 7, // 7 days
    );

    return {
      success: true,
      message: "Email verification successful.",
      route:
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole),
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Email verification failed: ${error?.response?.data?.message}`,
      route: "/login",
    };
  }
};
