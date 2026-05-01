"use client";

import { motion } from "motion/react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto p-10 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Content failed to load</h2>
          <p className="text-muted-foreground">
            There was a problem loading this section. You can try refreshing or come back later.
          </p>
        </div>

        <Button onClick={() => reset()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Reload Section
        </Button>
      </motion.div>
    </div>
  );
}
