import { VerifyEmailForm } from "@/components/modules/Auth/verify-email-form";
import { ModernAuthLayout } from "@/components/shared/ModernAuthLayout";

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; redirectPath?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const { email, redirectPath } = await searchParams;

  return (
    <ModernAuthLayout
      title="Verify Your Identity"
      description="Protecting your account is our top priority. Please enter the secure code below."
    >
      <VerifyEmailForm email={email || ""} redirectPath={redirectPath} />
    </ModernAuthLayout>
  );
};

export default VerifyEmailPage;
