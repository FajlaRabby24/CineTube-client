import { loginZodSchema } from "@/zod/auth.validation";
import z from "zod";

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    needPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    image: string;
    status: string;
    isDeleted: boolean;
    emailVerified: boolean;
  };
}
