/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { verifyEmailAction } from "@/services/Auth/verifyEmail.service";
import { IVerifyEmailOtpPayload } from "@/types/auth.types";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyEmailFormProps {
  email?: string;
  redirectPath?: string;
}

export function VerifyEmailForm({
  email: initialEmail,
  redirectPath,
}: VerifyEmailFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const { mutateAsync } = useMutation({
    mutationFn: ({ email, otp }: IVerifyEmailOtpPayload) =>
      verifyEmailAction(email, otp, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      otp: "",
      email: "",
    },

    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync({
          email: initialEmail || "",
          otp,
        })) as {
          success: boolean;
          message: string;
          route: string;
        };
        if (!result.success) {
          toast.error(result.message || "Email verification failed");
          return;
        }

        toast.success(result.message || "Email verification successful");
        router.push(result?.route);
      } catch (error) {
        toast.error("Email verification failed. Please try again.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/auth.svg"
              alt="Image"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
              width={500}
              height={500}
            />
          </div>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Verify your email</CardTitle>
              <CardDescription className="text-muted-foreground">
                We have sent a verification code to your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                method="POST"
                action="#"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <Field>
                    <div className="text-center text-sm text-muted-foreground">
                      Code sent to:{" "}
                      <span className="font-medium text-foreground">
                        {initialEmail
                          ? `${initialEmail.slice(0, 2)}${"*".repeat(initialEmail.indexOf("@") - 2)}${initialEmail.slice(initialEmail.indexOf("@"))}`
                          : ""}
                      </span>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel className="text-center justify-center">
                      Enter 6-digit code
                    </FieldLabel>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </Field>

                  <Field>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting}
                          pendingLabel="Verifying..."
                          disabled={otp.length !== 6}
                        >
                          Verify
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>
                    <FieldDescription className="text-center">
                      Did not receive the code?{" "}
                      <Link
                        href="#"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Resend
                      </Link>
                    </FieldDescription>
                    <FieldDescription className="text-center">
                      <Link
                        href="/login"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Back to login
                      </Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
