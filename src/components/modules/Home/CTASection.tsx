"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";

const CTASection = () => {
  return (
    <section className="w-full bg-slate-950 py-32 relative overflow-hidden border-t border-white/5">
      {/* Immersive background image with overlay */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 z-10" />
          <div className="absolute inset-0 bg-[url('/cta-bg.jpg')] bg-cover bg-center opacity-20 grayscale brightness-50" />
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-3xl mx-auto space-y-8"
        >
          <div className="space-y-4">
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-outfit tracking-tighter leading-none">
               Ready to start <br /><span className="text-primary italic">The Show?</span>
             </h2>
             <p className="text-slate-400 text-lg md:text-xl font-medium">
               Join millions of movie lovers today. Enter your email to create or restart your membership.
             </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-xl mx-auto p-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
             <div className="relative flex-1 w-full sm:w-auto">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                <Input
                   type="email"
                   placeholder="Email address"
                   className="h-14 bg-transparent border-none text-white placeholder:text-slate-500 pl-12 focus-visible:ring-0 text-lg"
                />
             </div>
             <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-white hover:bg-white hover:text-primary transition-all duration-300 font-black uppercase tracking-widest text-xs">
               Get Started <ChevronRightIcon className="ml-2 size-5" />
             </Button>
          </div>

          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
             No commitment. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
