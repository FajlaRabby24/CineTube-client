"use client";

import { motion } from "motion/react";

export function MediaHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-12 space-y-4 relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary"
      >
        Cinematic Library
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl font-black text-white md:text-6xl uppercase font-outfit tracking-tighter"
      >
        Discover <span className="text-primary italic">Movies</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-slate-400 max-w-2xl text-lg font-medium"
      >
        Explore our vast collection of feature films across all genres. From
        timeless classics to the latest blockbusters.
      </motion.p>
    </motion.div>
  );
}
