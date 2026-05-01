"use client";

import { motion } from "motion/react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full text-center space-y-8 p-12 rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex justify-center">
              <div className="p-6 rounded-full bg-destructive/10 animate-pulse">
                <AlertTriangle className="w-16 h-16 text-destructive" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight">Critical System Error</h1>
              <p className="text-muted-foreground text-lg">
                A critical error occurred at the root of the application. We're working to get it fixed.
              </p>
            </div>

            {error.digest && (
              <div className="py-2 px-4 bg-muted rounded-lg text-sm font-mono text-muted-foreground break-all">
                Reference ID: {error.digest}
              </div>
            )}

            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-xl font-bold text-lg"
            >
              <RefreshCcw className="w-5 h-5" />
              Recover Application
            </button>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
