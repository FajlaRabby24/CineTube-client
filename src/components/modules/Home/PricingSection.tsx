import { PricingCard } from "@/components/ui/pricing-card";

const plans = [
  {
    name: "Basic",
    description: "Perfect for movie enthusiasts",
    price: 10,
    period: "/mo",
    features: [
      "Unlimited movie searches",
      "Rate movies 1-10",
      "Write reviews",
      "Save favorites",
      "Basic recommendations",
    ],
    popular: false,
  },
  {
    name: "Premium",
    description: "For die-hard cinema lovers",
    price: 100,
    period: "/yr",
    features: [
      "Everything in Basic",
      "Early access to new features",
      "Ad-free experience",
      "Priority support",
      "Exclusive content",
      "Advanced analytics",
    ],
    popular: true,
  },
];

const PricingSection = () => {
  return (
    <section className="w-full bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your movie journey
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
