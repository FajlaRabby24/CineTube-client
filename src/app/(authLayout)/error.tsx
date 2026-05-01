"use client";

import { motion } from "motion/react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Authentication Error</h2>
          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
            We couldn't verify your identity. Please try logging in again.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => reset()} variant="default" className="w-full">
            Try Again
          </Button>
          <Button variant="ghost" asChild className="w-full gap-2 text-muted-foreground">
            <Link href="/login">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
