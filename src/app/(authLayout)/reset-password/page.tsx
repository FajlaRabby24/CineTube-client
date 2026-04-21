import { ResetPasswordForm } from "@/components/modules/Auth/reset-password-form";
import { ModernAuthLayout } from "@/components/shared/ModernAuthLayout";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) => {
  const { email } = await searchParams;
  return (
    <ModernAuthLayout
      title="Secure Your Account"
      description="Almost there! Enter your new password below to finalize the process."
    >
      <ResetPasswordForm email={email} />
    </ModernAuthLayout>
  );
};

export default ResetPasswordPage;
