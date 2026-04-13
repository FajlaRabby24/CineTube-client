import MediaManagement from "@/components/modules/Admin/MediaManagement";
import { getAllMedia } from "@/services/Media/getMedia.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const MediaManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) {
        return "";
      }

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
    queryKey: ["admin-media", queryString],
    queryFn: () => getAllMedia(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MediaManagement initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default MediaManagementPage;
