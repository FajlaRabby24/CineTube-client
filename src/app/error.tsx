"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8 p-8 rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5"
      >
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Something went wrong</h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Don't worry, it's not your fault.
          </p>
        </div>

        {error.digest && (
          <div className="py-2 px-3 bg-muted rounded-md text-xs font-mono text-muted-foreground truncate">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => reset()}
            variant="default"
            className="gap-2 px-6"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </Button>
          <Button variant="outline" asChild className="gap-2 px-6">
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
