"use server";

import { httpClient } from "@/lib/axios/httpClient";

export async function submitContactForm(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    const res = await httpClient.post("/contact", payload);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Something went wrong while sending message",
    };
  }
}
