"use client";

import { motion } from "motion/react";
import { AlertCircle, RefreshCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-6"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Module Error</h2>
          <p className="text-muted-foreground">
            We couldn't load this dashboard view. Your session and sidebar remain active.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            Retry View
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4" />
              Main Panel
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
