import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import PricingManagement from "@/components/modules/Admin/PricingManagement";
import { getAllPricingPlans } from "@/services/Admin/pricing.service";

const PricingManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-pricing-plans"],
    queryFn: () => getAllPricingPlans() as Promise<any>,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricingManagement />
    </HydrationBoundary>
  );
};

export default PricingManagementPage;
