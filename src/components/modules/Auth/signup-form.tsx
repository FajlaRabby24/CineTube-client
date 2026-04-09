"use client";

import GoogleLoginButton from "@/components/shared/forms/GoogleLoginButton";
import InputField from "@/components/shared/forms/InputField";
import PasswordField from "@/components/shared/forms/PasswordField";
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
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/utils/uploadFileInCloudinary";
import { validateImage } from "@/lib/utils/validateImage";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteFromCloudinary } from "../../../lib/utils/deleteFromCloudinary";
import { registerAction } from "../../../services/Auth/register.service";
import { IRegisterPayload } from "../../../types/auth.types";
import { registerZodSchema } from "../../../zod/auth.validation";
import AppSubmitButton from "../../shared/forms/AppSubmitButton";
import ImagePreview from "../../ui/file-priview";

interface RegisterFormProps {
  redirectPath?: string;
}

export function SignupForm({ redirectPath }: RegisterFormProps) {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      registerAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: null as File | null | undefined,
    },

    onSubmit: async ({ value }) => {
      let image: string | null | undefined = null;
      try {
        if (value.image) {
          const isValidImage = await validateImage(value.image);
          if (!isValidImage.success) {
            toast.error(isValidImage.message);
            return;
          }

          const uploadImage = await uploadToCloudinary(value.image);
          if (!uploadImage.success) {
            toast.error(uploadImage.message);
            return;
          }
          image = uploadImage?.data?.url;
          console.log(uploadImage, "from sign up form");
          // return;
        }
        const result = (await mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
          image,
        })) as {
          success: boolean;
          message: string;
          route: string;
        };
        console.log({ result }, "from sign up form");
        if (!result.success) {
          toast.error(result.message || "Registration failed");
          return;
        }

        toast.success(result.message || "Registration successful");
        router.push(result.route);
      } catch (error) {
        toast.error("Registration failed. Please try again.");
        console.log(error, "Error from signup-form service");
        if (image) {
          await deleteFromCloudinary(image, "image");
        }
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Card>
            <CardHeader className="text-center">
              <Link href="/" className="text-2xl font-bold">
                CT
              </Link>
              <CardTitle className="text-xl">Create your account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email below to create your account
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
                  <Field className="grid grid-cols-2 gap-4">
                    {/* email  */}
                    <form.Field
                      name="name"
                      validators={{ onChange: registerZodSchema.shape.name }}
                    >
                      {(field) => (
                        <InputField
                          field={field}
                          label="Full Name"
                          type="text"
                          placeholder="John Doe"
                        />
                      )}
                    </form.Field>

                    <Field>
                      <FieldLabel htmlFor="image">Image (optional)</FieldLabel>
                      <ImagePreview
                        onFileChange={(file) =>
                          form.setFieldValue("image", file)
                        }
                      />
                    </Field>
                  </Field>

                  {/* email  */}
                  <Field>
                    <form.Field
                      name="email"
                      validators={{ onChange: registerZodSchema.shape.email }}
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
                  </Field>

                  <Field>
                    {/* password  */}
                    <form.Field
                      name="password"
                      validators={{
                        onChange: registerZodSchema.shape.password,
                      }}
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
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Registering..."
                          disabled={!canSubmit}
                        >
                          Register
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>
                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-2">
                      Or continue with
                    </FieldSeparator>
                    <Field>
                      <GoogleLoginButton />
                    </Field>
                    <FieldDescription className="text-center">
                      Already have an account? <Link href="/login">Login</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/auth.svg"
              alt="Image"
              loading="eager"
              className="absolute inset-0 h-full w-full  object-cover "
              width={500}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
