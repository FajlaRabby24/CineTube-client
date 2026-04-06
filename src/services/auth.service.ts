"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  ILoginPayload,
  ILoginResponse,
  IRegisterPayload,
  IRegisterResponse,
} from "@/types/auth.types";
import { loginZodSchema, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "../lib/authUtilts";
import { setTokenInCookies } from "../lib/tokenUtils";

export const registerAction = async (payload: IRegisterPayload) => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  const dataToSend = { ...parsedPayload.data };
  if (!dataToSend.image) {
    delete dataToSend.image;
  }

  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      dataToSend,
    );
    console.log(response, "from auth service");
    return { success: true, message: response.message };
  } catch (error: any) {
    return {
      success: false,
      message: `Registration failed: ${error?.response?.data?.message}`,
    };
  }
};

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );
    const {
      accessToken,
      refreshToken,
      token,
      user: { needPasswordChange, email, role, emailVerified },
    } = response.data;
    console.log(response.data, "response data");
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      token,
      60 * 60 * 24 * 7, // 7 days
    );

    if (!emailVerified) {
      redirect(`/verify-email?email=${email}`);
    } else if (needPasswordChange) {
      redirect(`/reset-password?email=${email}`);
    } else {
      const targetPath =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);

      redirect(targetPath);
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Login failed: ${error?.response?.data?.message}`,
    };
  }
};
