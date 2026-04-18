"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getUserInfo } from "@/services/Auth/getMe.service";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  getUserSubscription,
  ISubscriptionResponse,
} from "@/services/Subscription/subscription.service";
import { useEffect, useState } from "react";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "/mo",
    planKey: "FREE",
    features: [
      "Everything in Standard",
      "Ultra HD (4K) + HDR",
      "Watch on 4 devices",
      "Offline downloads",
      "Exclusive creator content",
    ],
    popular: false,
    color: "bg-slate-800",
  },
  {
    name: "Standard",
    price: 10,
    period: "/mo",
    planKey: "MONTHLY",
    features: [
      "Everything in Standard",
      "Ultra HD (4K) + HDR",
      "Watch on 4 devices",
      "Offline downloads",
      "Exclusive creator content",
    ],
    popular: true,
    color: "bg-primary",
  },
  {
    name: "Premium",
    price: 99.99,
    period: "/year",
    planKey: "YEARLY",
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
  const router = useRouter();
  const pathname = usePathname();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [subscription, setSubscription] =
    useState<ISubscriptionResponse | null>(null);

  useEffect(() => {
    const fetchSub = async () => {
      const sub = await getUserSubscription();
      setSubscription(sub);
    };
    fetchSub();
  }, []);

  const handleSubscribe = async (planKey: string) => {
    try {
      setLoadingPlan(planKey);
      const user = await getUserInfo();

      if (!user) {
        toast.error("Please login to subscribe to a plan");
        router.push(`/login?redirectPath=${pathname}`);
        return;
      }

      // If user is already on this exact plan
      if (subscription?.plan === planKey && subscription?.status === "ACTIVE") {
        toast.info("You are already on this plan!");
        return;
      }

      // If user has ANY paid plan and wants to manage/change
      if (subscription && subscription.plan !== "FREE") {
        toast.loading("Opening management portal...", { id: "portal" });
        const res = await createCustomerPortalSession();
        if (res?.success && res?.data?.url) {
          window.location.href = res.data.url;
          return;
        } else {
          toast.error("Failed to open management portal", { id: "portal" });
          return;
        }
      }

      if (planKey === "FREE") {
        toast.success("You are already on the Free plan!");
        return;
      }

      toast.loading("Preparing checkout...", { id: "checkout" });
      const res = await createCheckoutSession(planKey);

      if (res?.success && res?.data?.paymentUrl) {
        toast.success("Redirecting to checkout...", { id: "checkout" });
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error(res?.message || "Failed to create checkout session", {
          id: "checkout",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("An error occurred. Please try again.", { id: "checkout" });
    } finally {
      setLoadingPlan(null);
    }
  };

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
                  onClick={() => handleSubscribe(plan.planKey)}
                  disabled={loadingPlan === plan.planKey}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-white hover:text-primary"
                      : "bg-white/10 text-white hover:bg-white hover:text-slate-950"
                  }`}
                >
                  {loadingPlan === plan.planKey ? (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  ) : subscription?.plan === plan.planKey &&
                    subscription?.status === "ACTIVE" ? (
                    "Current Plan"
                  ) : subscription && subscription.plan !== "FREE" ? (
                    "Manage Subscription"
                  ) : (
                    <>
                      Start Your Journey{" "}
                      <ChevronRightIcon className="ml-2 size-4" />
                    </>
                  )}
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
