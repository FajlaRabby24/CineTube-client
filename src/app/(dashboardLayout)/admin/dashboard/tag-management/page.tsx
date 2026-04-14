import TagManagement from "@/components/modules/Admin/TagManagement";
import { getAllTags } from "@/services/Admin/tags.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const TagManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-tags"],
    queryFn: () => getAllTags(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagManagement />
    </HydrationBoundary>
  );
};

export default TagManagementPage;
