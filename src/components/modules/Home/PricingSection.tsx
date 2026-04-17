"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "/mo",
    features: [
      "Access to all movies",
      "Standard Definition",
      "Watch on 1 device",
      "Unlimited reviews",
      "No ads",
    ],
    popular: false,
    color: "bg-slate-800",
  },
  {
    name: "Standard",
    price: 10,
    period: "/mo",
    features: [
      "Everything in Basic",
      "Full HD (1080p)",
      "Watch on 2 devices",
      "Personalized recommendations",
      "Priority streaming",
    ],
    popular: true,
    color: "bg-primary",
  },
  {
    name: "Premium",
    price: 99.99,
    period: "/year",
    features: [
      "Everything in Standard",
      "Ultra HD (4K) + HDR",
      "Watch on 4 devices",
      "Offline downloads",
      "Exclusive creator content",
    ],
    popular: false,
    color: "bg-blue-600",
  },
];

const PricingSection = () => {
  return (
    <section className="w-full bg-slate-950 py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-white md:text-5xl uppercase font-outfit tracking-tighter">
            Choose Your <span className="text-primary italic">Adventure</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Unlock the ultimate cinematic experience with plans tailored to your
            needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group rounded-[2.5rem] p-10 flex flex-col justify-between border transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? "bg-white/10 border-primary shadow-[0_0_40px_-15px_rgba(229,9,20,0.5)] scale-105"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-outfit">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white font-outfit tracking-tighter">
                      ${plan.price}
                    </span>
                    <span className="text-slate-500 font-bold uppercase text-xs">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 group/feat"
                    >
                      <div
                        className={`p-1 rounded-full ${plan.popular ? "bg-primary text-white" : "bg-white/10 text-slate-400"}`}
                      >
                        <CheckIcon className="size-3" />
                      </div>
                      <span className="text-slate-300 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <Button
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-white hover:text-primary"
                      : "bg-white/10 text-white hover:bg-white hover:text-slate-950"
                  }`}
                >
                  Start Your Journey{" "}
                  <ChevronRightIcon className="ml-2 size-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          Prices may vary based on your location. Cancel anytime.
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
