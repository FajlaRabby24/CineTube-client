import ReviewManagement from "@/components/modules/Admin/ReviewManagement";
import { getAdminReviews } from "@/services/Admin/getAdminReviews.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const ReviewManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) return "";
      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-reviews", queryString],
    queryFn: () => getAdminReviews(queryString),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });

  // TODO: check after complete the project

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewManagement initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default ReviewManagementPage;
