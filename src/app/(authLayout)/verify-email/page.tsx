import { VerifyEmailForm } from "@/components/modules/Auth/verify-email-form";
import { AuthBackground } from "@/components/shared/AuthBackground";

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; redirectPath?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const { email, redirectPath } = await searchParams;
  console.log({ email, redirectPath });
  console.log(await searchParams, "searchparams");
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
          <VerifyEmailForm email={email} redirectPath={redirectPath} />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
