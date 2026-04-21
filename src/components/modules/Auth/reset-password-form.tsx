"use client";

import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import InputField from "@/components/shared/forms/InputField";
import PasswordField from "@/components/shared/forms/PasswordField";
import { FieldGroup } from "@/components/ui/field";
import { resetPasswordAction } from "@/services/Auth/resetPassword.service";
import { resetPasswordSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: { otp: string; password: string }) =>
      resetPasswordAction({
        email: email as string,
        otp: data.otp,
        newPassword: data.password,
      }),
  });

  const form = useForm({
    defaultValues: {
      otp: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (!email) {
        toast.error(
          "Required reset information (email) is missing from the URL.",
        );
        return;
      }

      try {
        const result = await mutateAsync(value);
        if (result.success) {
          toast.success(result.message);
          router.push(result.route || "/login");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to reset password");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="space-y-6">
        <form.Field
          name="otp"
          validators={{
            onChange: resetPasswordSchema.shape.otp,
          }}
        >
          {(field) => (
            <InputField
              field={field}
              label="One-Time Password (OTP)"
              placeholder="123456"
              className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
              labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: resetPasswordSchema.shape.newPassword,
          }}
        >
          {(field) => (
            <PasswordField
              field={field}
              label="New Password"
              id="password"
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white focus:border-red-600 transition-colors"
              labelClassName="text-slate-300 font-bold uppercase tracking-widest text-[10px]"
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <AppSubmitButton
              isPending={isSubmitting || isPending}
              pendingLabel="Resetting..."
              disabled={!canSubmit || !email}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]"
            >
              Reset Password
            </AppSubmitButton>
          )}
        </form.Subscribe>

        {!email && (
          <p className="text-center text-xs font-bold text-red-500 uppercase tracking-widest">
            Invalid reset link. Please check your email.
          </p>
        )}
      </FieldGroup>
    </form>
  );
}
