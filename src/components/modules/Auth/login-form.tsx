"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import InputField from "@/components/shared/forms/InputField";
import PasswordField from "@/components/shared/forms/PasswordField";
import { Button } from "@/components/ui/button";
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
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { loginAction } from "@/services/auth.service";
import { ILoginPayload } from "@/types/auth.types";
import { loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
  redirectPath?: string;
}

export function LoginForm({ redirectPath }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);
      } catch (error: any) {
        console.log(`Login failed: ${error.message}`);
        setServerError(`Login failed: ${error.message}`);
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
              className="absolute inset-0 h-full w-full object-cover "
              width={500}
              height={500}
            />
          </div>
          <Card>
            <CardHeader className="text-center">
              <Link href="/" className="text-2xl font-bold">
                CT
              </Link>
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Login to your CuneTube account
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
                  {/* email  */}
                  <form.Field
                    name="email"
                    validators={{ onChange: loginZodSchema.shape.email }}
                  >
                    {(field) => (
                      <InputField
                        field={field}
                        label="Email"
                        type="email"
                        placeholder="example@gamil.com"
                      />
                    )}
                  </form.Field>

                  {/* password  */}
                  <form.Field
                    name="password"
                    validators={{ onChange: loginZodSchema.shape.password }}
                  >
                    {(field) => (
                      <PasswordField
                        field={field}
                        label="Password"
                        id="password"
                        placeholder="Password"
                      />
                    )}
                  </form.Field>

                  <Field>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Logging In...."
                          disabled={!canSubmit}
                        >
                          Log In
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>

                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-2">
                      Or continue with
                    </FieldSeparator>
                    <Field>
                      <Button variant="outline" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="sr-only">Sign up with Google</span>
                      </Button>
                    </Field>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <Link href="/register">Register</Link>
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
