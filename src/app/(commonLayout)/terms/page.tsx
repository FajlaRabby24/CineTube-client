import { BackgroundEffects } from "@/components/ui/background-effects";
import { Shield, Users, Info, Scale, Award } from "lucide-react";

export const metadata = {
  title: "Terms of Service - CineTube",
  description: "Terms of Service and portfolio project disclaimer for CineTube.",
};

const termsSections = [
  {
    id: "disclaimer",
    title: "1. Portfolio Project Disclaimer",
    icon: Award,
    content: (
      <p>
        <strong>CineTube</strong> is a full-stack portfolio web application built by <strong>Fajla Rabby</strong> to demonstrate expert-level capability in <strong>Next.js, TypeScript, Prisma ORM, and PostgreSQL</strong>. Any payment processing, media streaming, or account options presented are simulated mocks for showcase purposes. No actual financial transactions will be processed.
      </p>
    ),
  },
  {
    id: "acceptance",
    title: "2. Acceptance of Terms",
    icon: Scale,
    content: (
      <p>
        By accessing, registering, or interacting with CineTube, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of this demonstration application.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "3. User Accounts & Mock Subscriptions",
    icon: Users,
    content: (
      <p>
        Users may create accounts to test features such as watchlist bookmarks, movie ratings, and user reviews. You agree to use demo credentials or safe inputs. Any mock subscriptions selected are free of charge and serve to showcase role-based dashboards (User vs. Admin features).
      </p>
    ),
  },
  {
    id: "intellectual",
    title: "4. Intellectual Property & Content",
    icon: Info,
    content: (
      <p>
        All media details, cover art, and titles displayed are sourced from public movie metadata databases or YouTube trailers. This application is strictly for educational and self-promotional review. No video assets are hosted or distributed directly by this application.
      </p>
    ),
  },
  {
    id: "liability",
    title: "5. Limitation of Liability",
    icon: Shield,
    content: (
      <p>
        This software is provided "as is" without warranties of any kind. Fajla Rabby shall not be liable for any direct, indirect, or incidental issues arising from testing or reviewing this demonstration project.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-start justify-center pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Cinematic theme background effects */}
      <BackgroundEffects />

      <div className="max-w-3xl w-full space-y-8 z-10">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Terms of <span className="text-red-500">Service</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto font-medium">
            Read the terms and portfolio project disclaimer for the CineTube application.
          </p>
        </div>

        {/* Content Box */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 space-y-6 text-gray-300">
          <div className="border-b border-white/5 pb-4">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Last Updated: July 13, 2026
            </p>
          </div>

          <div className="space-y-6">
            {termsSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="space-y-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon className="size-4.5 text-red-500" />
                    {section.title}
                  </h3>
                  <div className="text-xs sm:text-sm leading-relaxed pl-6.5 text-gray-400">
                    {section.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/5 pt-6 text-center text-xs text-gray-500 font-medium">
            Designed and engineered by Fajla Rabby. For inquiries, visit the{" "}
            <a href="/contact" className="text-red-500 hover:underline">
              Contact Page
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
