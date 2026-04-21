import UserDashboardContent from "@/components/modules/Dashboard/UserDashboardContent";
import { getUserDashboardStats } from "@/services/Dashboard/userDashboard.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const DashboardPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: getUserDashboardStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDashboardContent />
    </HydrationBoundary>
  );
};

export default DashboardPage;
