"use client";

import { motion } from "motion/react";
import { Search, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full text-center space-y-12">
        {/* Animated Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-primary/20 blur-[100px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-9xl font-black tracking-tighter text-foreground/10 select-none">
            404
          </h1>
          <div className="relative -mt-16 sm:-mt-24">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md">
                <Search className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Page not found</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2 h-12 px-8">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button asChild className="gap-2 h-12 px-8">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-border/50"
        >
          <p className="text-sm text-muted-foreground">
            Think this is a mistake?{" "}
            <Link href="/contact" className="text-primary hover:underline underline-offset-4">
              Contact support
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
